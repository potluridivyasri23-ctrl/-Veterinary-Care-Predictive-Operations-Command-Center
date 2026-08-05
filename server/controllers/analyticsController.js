const { pool } = require('../config/db');

async function getDashboardAnalytics(req, res, next) {
  try {
    const [kpiResult, activityResult, appointmentResult] = await Promise.all([
      pool.query(`SELECT
        (SELECT COUNT(*) FROM appointments WHERE status = 'scheduled') AS case_volume,
        (SELECT AVG(wait_minutes) FROM appointments WHERE wait_minutes IS NOT NULL) AS waiting_time,
        (SELECT COUNT(*) FROM animals WHERE status = 'active') AS kennel_occupancy,
        (SELECT COUNT(*) FROM tasks WHERE status != 'completed') AS procedure_load,
        (SELECT COUNT(*) FROM appointments WHERE status = 'completed' AND follow_up_required = true) AS follow_up_completion,
        (SELECT COUNT(*) FROM alerts WHERE severity = 'critical') AS emergency_sla`),
      pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5'),
      pool.query('SELECT * FROM appointments WHERE appointment_date = CURRENT_DATE ORDER BY appointment_time ASC LIMIT 10'),
    ]);
    res.json({ kpis: kpiResult.rows[0], recentActivities: activityResult.rows, todayAppointments: appointmentResult.rows });
  } catch (err) {
    next(err);
  }
}

async function getForecasts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM forecasts ORDER BY generated_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getRiskScores(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM risk_scores ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getTrendData(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        appointment_date AS date,
        COUNT(*) FILTER (WHERE status = 'scheduled') AS case_volume,
        AVG(wait_minutes) AS waiting_time,
        SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) AS procedure_load,
        COUNT(DISTINCT animal_id) AS unique_animals
      FROM appointments
      WHERE appointment_date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY appointment_date
      ORDER BY appointment_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getCapacityPlans(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM capacity_plans ORDER BY plan_date DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function runScheduledJobs(req, res, next) {
  try {
    const forecastResult = await pool.query(
      `INSERT INTO forecasts (forecast_type, values, confidence, created_by)
       SELECT 'demand', jsonb_build_object('next_week', COUNT(*), 'next_month', COUNT(*) * 4), 0.85, $1
       FROM appointments
       WHERE appointment_date >= CURRENT_DATE - INTERVAL '30 days'
       RETURNING *`,
      [req.user.id]
    );

    const anomalyCompare = await pool.query(
      `SELECT COUNT(*) FILTER (WHERE wait_minutes > 30) AS high_waits FROM appointments WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days'`
    );
    const highWaits = Number(anomalyCompare.rows[0].high_waits);
    let anomalyResult = null;
    if (highWaits > 5) {
      anomalyResult = await pool.query(
        'INSERT INTO anomalies (description, severity, evidence, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        ['High waiting time anomaly detected', 'critical', JSON.stringify({ high_waits: highWaits }), req.user.id]
      );
    }

    res.json({ forecasts: forecastResult.rows, anomaly: anomalyResult?.rows?.[0] || null });
  } catch (err) {
    next(err);
  }
}

async function runScenario(req, res, next) {
  try {
    const { name, demandMultiplier, capacityAdjustment } = req.body;
    const [currentDemandRes, currentCapacityRes] = await Promise.all([
      pool.query("SELECT COUNT(*) AS upcoming_appointments FROM appointments WHERE appointment_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'"),
      pool.query("SELECT COUNT(*) AS active_animals FROM animals WHERE status = $1", ['active'])
    ]);

    const currentDemand = Number(currentDemandRes.rows[0].upcoming_appointments || 0);
    const currentCapacity = Number(currentCapacityRes.rows[0].active_animals || 0) * 2;
    const projectedDemand = Math.round(currentDemand * demandMultiplier);
    const adjustedCapacity = currentCapacity + Number(capacityAdjustment);
    const capacityGap = projectedDemand - adjustedCapacity;
    const recommendation = capacityGap > 0
      ? `Increase staffing by ${capacityGap} slots or schedule additional technicians.`
      : 'Capacity is sufficient for the forecasted demand.';

    res.json({
      name,
      current_demand: currentDemand,
      projected_demand: projectedDemand,
      current_capacity: currentCapacity,
      adjusted_capacity: adjustedCapacity,
      capacity_gap: capacityGap,
      recommendation,
      generated_at: new Date()
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardAnalytics,
  getForecasts,
  getRiskScores,
  getTrendData,
  getCapacityPlans,
  runScheduledJobs,
  runScenario,
};
