CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  last_login TIMESTAMP,
  reset_token VARCHAR(256),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS owners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(256),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS animals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  species VARCHAR(64) NOT NULL,
  breed VARCHAR(128),
  age INTEGER,
  sex VARCHAR(32),
  owner_id INTEGER REFERENCES owners(id) ON DELETE SET NULL,
  medical_history TEXT,
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  owner_id INTEGER REFERENCES owners(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  service_type VARCHAR(128),
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(64) DEFAULT 'scheduled',
  priority VARCHAR(32) DEFAULT 'normal',
  notes TEXT,
  wait_minutes INTEGER,
  follow_up_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diagnostics (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
  findings TEXT,
  tests_ordered TEXT,
  result_summary TEXT,
  status VARCHAR(64) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
  description TEXT,
  medications TEXT,
  status VARCHAR(64) DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  vaccine_name VARCHAR(128),
  dose VARCHAR(64),
  scheduled_date DATE,
  status VARCHAR(64) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
  total_amount NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  due_date DATE,
  status VARCHAR(64) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method VARCHAR(64),
  recorded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  payment_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  record_type VARCHAR(128),
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  description TEXT,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(64) DEFAULT 'open',
  priority VARCHAR(64) DEFAULT 'normal',
  due_date DATE,
  category VARCHAR(128),
  notes TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  category VARCHAR(128),
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  target_type VARCHAR(128),
  target_id INTEGER,
  severity VARCHAR(32),
  message TEXT,
  status VARCHAR(32) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forecasts (
  id SERIAL PRIMARY KEY,
  forecast_type VARCHAR(128),
  values JSONB,
  confidence NUMERIC(5,2),
  generated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS risk_scores (
  id SERIAL PRIMARY KEY,
  risk_type VARCHAR(128),
  score NUMERIC(5,2),
  status VARCHAR(32),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS anomalies (
  id SERIAL PRIMARY KEY,
  description TEXT,
  severity VARCHAR(32),
  evidence JSONB,
  status VARCHAR(32) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS capacity_plans (
  id SERIAL PRIMARY KEY,
  plan_date DATE,
  capacity_details JSONB,
  status VARCHAR(32) DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  type VARCHAR(128),
  name VARCHAR(256),
  filters JSONB,
  status VARCHAR(64) DEFAULT 'completed',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  target_type VARCHAR(128),
  target_id INTEGER,
  decision VARCHAR(32),
  decided_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS overrides (
  id SERIAL PRIMARY KEY,
  target_type VARCHAR(128),
  target_id INTEGER,
  reason TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(128),
  target_type VARCHAR(128),
  target_id INTEGER,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configurations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(128) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(128),
  subject VARCHAR(256),
  prompt TEXT,
  response JSONB,
  confidence NUMERIC(5,2),
  model_version VARCHAR(128),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(32) DEFAULT 'pending',
  review_comment TEXT,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
