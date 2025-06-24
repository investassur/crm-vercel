-- Création des utilisateurs de test pour Premunia CRM
-- Mot de passe par défaut pour tous les utilisateurs : "premunia2024"
-- Hash bcrypt pour "premunia2024" : $2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC

-- Supprimer les utilisateurs existants s'ils existent
DELETE FROM user_sessions WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%@premunia.com' OR email LIKE '%@premunia.fr'
);

DELETE FROM users WHERE email LIKE '%@premunia.com' OR email LIKE '%@premunia.fr';

-- Insérer les nouveaux utilisateurs de test
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  department, 
  permissions,
  is_active,
  created_at
) VALUES 
-- Super Admin
(
  'h.mekni@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Hamdi',
  'MEKNI',
  'super_admin',
  'Direction',
  '{"all": true, "prospects": {"read": true, "write": true, "delete": true}, "contracts": {"read": true, "write": true, "delete": true}, "campaigns": {"read": true, "write": true, "delete": true}, "users": {"read": true, "write": true, "delete": true}, "reports": {"read": true, "write": true}, "administration": {"read": true, "write": true}}',
  true,
  CURRENT_TIMESTAMP
),

-- Admin
(
  'imen.kamoun@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Imen',
  'KAMOUN',
  'admin',
  'Administration',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": true, "delete": false}, "users": {"read": true, "write": true, "delete": false}, "reports": {"read": true, "write": true}, "administration": {"read": true, "write": false}}',
  true,
  CURRENT_TIMESTAMP
),

-- Gestionnaire
(
  'gestion@premunia.fr',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Ibtissem',
  'GESTION',
  'manager',
  'Gestion',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": false, "delete": false}, "reports": {"read": true, "write": false}}',
  true,
  CURRENT_TIMESTAMP
),

-- Agent Qualité
(
  'o.aouididi@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Olfa',
  'AOUIDIDI',
  'agent',
  'Qualité',
  '{"prospects": {"read": true, "write": false, "delete": false}, "contracts": {"read": true, "write": false, "delete": false}, "reports": {"read": true, "write": false}}',
  true,
  CURRENT_TIMESTAMP
),

-- Commerciaux
(
  'z.snoussi@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Zouhair',
  'SNOUSSI',
  'agent',
  'Commercial',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": false, "delete": false}}',
  true,
  CURRENT_TIMESTAMP
),

(
  'p.maatoug@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Radhia',
  'MAATOUG',
  'agent',
  'Commercial',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": false, "delete": false}}',
  true,
  CURRENT_TIMESTAMP
),

(
  'm.dahmani@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Mouna',
  'DAHMANI',
  'agent',
  'Commercial',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": false, "delete": false}}',
  true,
  CURRENT_TIMESTAMP
),

(
  'm.khribi@premunia.com',
  '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC',
  'Mariem',
  'KHRIBI',
  'agent',
  'Commercial',
  '{"prospects": {"read": true, "write": true, "delete": false}, "contracts": {"read": true, "write": true, "delete": false}, "campaigns": {"read": true, "write": false, "delete": false}}',
  true,
  CURRENT_TIMESTAMP
);

-- Vérifier que les utilisateurs ont été créés
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  department,
  is_active,
  created_at
FROM users 
WHERE email LIKE '%@premunia.com' OR email LIKE '%@premunia.fr'
ORDER BY role DESC, last_name;
