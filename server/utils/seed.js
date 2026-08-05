require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function run() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);

  const password = await bcrypt.hash('VetPass123', 10);
  await pool.query('DELETE FROM ai_recommendations');
  await pool.query('DELETE FROM approvals');
  await pool.query('DELETE FROM anomalies');
  await pool.query('DELETE FROM alerts');
  await pool.query('DELETE FROM bills');
  await pool.query('DELETE FROM capacity_plans');
  await pool.query('DELETE FROM configurations');
  await pool.query('DELETE FROM diagnostics');
  await pool.query('DELETE FROM medical_records');
  await pool.query('DELETE FROM notifications');
  await pool.query('DELETE FROM appointments');
  await pool.query('DELETE FROM tasks');
  await pool.query('DELETE FROM forecasts');
  await pool.query('DELETE FROM risk_scores');
  await pool.query('DELETE FROM animals');
  await pool.query('DELETE FROM owners');
  await pool.query('DELETE FROM users');
  await pool.query('DELETE FROM reports');
  await pool.query('DELETE FROM overrides');
  await pool.query('DELETE FROM audit_logs');

  await pool.query(`INSERT INTO users (name, email, password, role, status) VALUES
    ('Ava Operations', 'opsadmin@vetcenter.com', $1, 'Operations Admin', 'active'),
    ('Mia Manager', 'manager@vetcenter.com', $1, 'Hospital Manager', 'active'),
    ('Lucas Reception', 'reception@vetcenter.com', $1, 'Receptionist', 'active'),
    ('Noah Vet', 'vet@vetcenter.com', $1, 'Veterinarian', 'active'),
    ('Emma Tech', 'tech@vetcenter.com', $1, 'Technician', 'active'),
    ('Olivia Analyst', 'analyst@vetcenter.com', $1, 'Analyst', 'active'),
    ('Ethan Field', 'field@vetcenter.com', $1, 'Field Staff', 'active')`, [password]);

  await pool.query(`INSERT INTO owners (name, phone, email, address, notes) VALUES
    ('Jordan Taylor', '555-0100', 'jordan@example.com', '101 Main St', 'Regular checkups'),
    ('Nina Roberts', '555-0101', 'nina@example.com', '202 Lake Ave', 'Diabetic cat'),
    ('Oliver Park', '555-0102', 'oliver@example.com', '303 Oak St', 'New adoption')`);

  await pool.query(`INSERT INTO animals (name, species, breed, age, sex, owner_id, medical_history) VALUES
    ('Buddy', 'Dog', 'Labrador', 4, 'Male', 1, 'Vaccinated, arthritis support'),
    ('Luna', 'Cat', 'Siamese', 2, 'Female', 2, 'Allergy to chicken'),
    ('Coco', 'Rabbit', 'Lionhead', 1, 'Female', 3, 'Spayed')`);

  await pool.query(`INSERT INTO appointments (animal_id, owner_id, appointment_date, appointment_time, service_type, assigned_to, status, priority, notes, wait_minutes, follow_up_required) VALUES
    (1, 1, CURRENT_DATE, '09:00', 'Wellness Check', 4, 'scheduled', 'high', 'Annual exam', 15, true),
    (2, 2, CURRENT_DATE, '10:30', 'Diagnostic Imaging', 4, 'scheduled', 'normal', 'Check respiratory symptoms', 20, false),
    (3, 3, CURRENT_DATE + INTERVAL '1 day', '11:00', 'Vaccination', 5, 'scheduled', 'normal', 'Rabies vaccine', 0, false)`);

  await pool.query(`INSERT INTO tasks (title, description, assigned_to, status, priority, due_date, category, created_by) VALUES
    ('Process Lab Results', 'Review diagnostic reports and update chart', 5, 'open', 'high', CURRENT_DATE + INTERVAL '1 day', 'Diagnostics', 4),
    ('Prepare Surgery Room', 'Sterilize tools and prepare anesthesia', 5, 'in progress', 'critical', CURRENT_DATE, 'Treatment', 4)`);

  await pool.query(`INSERT INTO notifications (recipient_id, message, category) VALUES
    (4, 'New appointment scheduled for Buddy at 09:00', 'appointment'),
    (5, 'Urgent task assigned: Prepare Surgery Room', 'task')`);

  await pool.query(`INSERT INTO diagnostics (appointment_id, findings, tests_ordered, result_summary, status) VALUES
    (1, 'Mild joint pain and stiffness, slight swelling around the left hind leg.', 'X-ray, blood test', 'Early-stage arthritis confirmed. Recommend dietary support and daily joint supplements.', 'completed'),
    (2, 'Coughing and nasal discharge with mild lethargy.', 'Chest X-ray, respiratory panel', 'Upper respiratory infection likely. Prescribe antibiotics and nebulizer treatments.', 'in progress')`);

  await pool.query(`INSERT INTO treatments (appointment_id, description, medications, status) VALUES
    (1, 'Initiate arthritis management plan for Buddy: reduce weight, mild exercise, joint support supplements.', 'Glucosamine, Fish oil', 'ongoing'),
    (2, 'Start antibiotic regimen and recheck in 5 days for Luna’s respiratory infection.', 'Amoxicillin, Cough syrup', 'in progress')`);

  await pool.query(`INSERT INTO medical_records (animal_id, record_type, notes, created_by) VALUES
    (1, 'Allergy', 'Patient shows seasonal skin irritation and responds well to hypoallergenic food. Monitor reactions and avoid dairy-based treats.', 4),
    (2, 'Vaccination', 'Rabies and FVRCP vaccines administered. Owner advised on booster schedule and diet changes.', 5),
    (3, 'Post-surgery care', 'Spay surgery completed successfully. Prescribed pain management and wound care checklist.', 4)`);

  await pool.query(`INSERT INTO forecasts (forecast_type, values, confidence, created_by) VALUES
    ('demand', '{"next_week": 28, "next_month": 110}', 0.87, 6),
    ('workload', '{"technician_hours": 120, "veterinarian_hours": 98}', 0.82, 6)`);

  await pool.query(`INSERT INTO risk_scores (risk_type, score, status, details, created_by) VALUES
    ('capacity', 74.5, 'warning', '{"message": "Kennel occupancy approaching threshold"}', 6),
    ('service', 61.0, 'normal', '{"message": "Appointment wait risk is stable"}', 6)`);

  await pool.query(`INSERT INTO reports (type, name, filters, status, created_by) VALUES
    ('Operational', 'Weekly Operations Summary', '{"dateRange":"last_7_days"}', 'completed', 6)`);

  await pool.query(`INSERT INTO ai_recommendations (type, subject, prompt, response, confidence, model_version, user_id, status) VALUES
    ('recommendation', 'Optimize staffing for weekend demand', 'Generate a concise recommendation for upcoming weekend staffing needs', '{"summary": "Increase staff coverage for high-demand Saturday"}', 0.91, 'gemini-1', 6, 'pending')`);

  await pool.query(`INSERT INTO audit_logs (user_id, action, target_type, target_id, details) VALUES
    (6, 'login', 'User', 6, '{"info": "Analyst logged in"}'),
    (4, 'create', 'Appointment', 1, '{"notes": "Booking created for Buddy"}')`);

  console.log('Seed data loaded successfully');
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
