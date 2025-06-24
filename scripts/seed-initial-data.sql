-- Insertion des données initiales pour AssurCRM

-- Utilisateurs par défaut
INSERT INTO users (email, password_hash, first_name, last_name, role, department, permissions) VALUES
('admin@assurcrm.fr', '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC', 'Admin', 'Principal', 'super_admin', 'Direction', '{"all": true}'),
('manager@assurcrm.fr', '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC', 'Manager', 'Commercial', 'manager', 'Commercial', '{"prospects": {"read": true, "write": true}, "contracts": {"read": true, "write": true}, "campaigns": {"read": true, "write": true}}'),
('agent1@assurcrm.fr', '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC', 'Jean', 'Dupont', 'agent', 'Commercial', '{"prospects": {"read": true, "write": true}, "contracts": {"read": true, "write": false}}'),
('agent2@assurcrm.fr', '$2a$12$LQv3c1yqBwEHFl5ygkTOsu.vrddgfOllRuoWiUlFa0VQ/ZqKK2OyC', 'Marie', 'Martin', 'agent', 'Commercial', '{"prospects": {"read": true, "write": true}, "contracts": {"read": true, "write": false}}')
ON CONFLICT (email) DO NOTHING;

-- Prospects d'exemple
INSERT INTO prospects (first_name, last_name, email, phone, age, status, source, notes, ville, origine, assigned_to) VALUES
('Premunia', 'Pro1', 'premunia.pro1@email.com', '0123456789', 65, 'nouveau', 'publicité', 'Prospect intéressé par assurance santé senior', 'Paris', 'Google Ads', 3),
('Premunia', 'Pro', 'premunia.pro@email.com', '0123456790', 68, 'nouveau', 'publicité', 'Demande de devis assurance vie', 'Lyon', 'Facebook Ads', 3),
('Mekni', 'Hamdi', 'mekni.hamdi@email.com', '0123456791', 70, 'nouveau', 'site_web', 'Contact via formulaire web', 'Marseille', 'Site Web', 4),
('Marie', 'Martin', 'marie.martin@email.com', '0123456789', 65, 'qualifié', 'site_web', 'Intéressée par complémentaire santé', 'Toulouse', 'Référencement naturel', 3),
('Pierre', 'Durand', 'pierre.durand@email.com', '0987654321', 70, 'qualifié', 'recommandation', 'Recommandé par client existant', 'Nice', 'Bouche à oreille', 4),
('Sophie', 'Bernard', 'sophie.bernard@email.com', '0147258369', 68, 'en_negociation', 'publicité', 'En cours de négociation contrat obsèques', 'Bordeaux', 'Publicité radio', 3),
('Claude', 'Moreau', 'claude.moreau@email.com', '0156789123', 72, 'converti', 'recommandation', 'Client converti - contrat signé', 'Lille', 'Recommandation', 4),
('Françoise', 'Petit', 'francoise.petit@email.com', '0167891234', 66, 'nouveau', 'site_web', 'Demande d\'information assurance dépendance', 'Strasbourg', 'Site Web', 3)
ON CONFLICT DO NOTHING;

-- Contrats d'exemple
INSERT INTO contracts (prospect_id, contract_number, product_type, premium_amount, commission_rate, status, start_date, end_date, compagnie, cotisation_mensuelle, cotisation_annuelle, notes) VALUES
(7, 'CNT-2024-001', 'Assurance Santé Senior', 2400.00, 15.0, 'actif', '2024-01-15', '2024-12-31', 'Malakoff Humanis', 200.00, 2400.00, 'Contrat complémentaire santé senior'),
(7, 'CNT-2024-002', 'Assurance Obsèques', 1200.00, 20.0, 'actif', '2024-02-01', '2025-01-31', 'Allianz', 100.00, 1200.00, 'Contrat obsèques avec capital 8000€'),
(6, 'CNT-2024-003', 'Assurance Dépendance', 3600.00, 18.0, 'en_cours', '2024-06-01', '2025-05-31', 'AXA', 300.00, 3600.00, 'Contrat en cours de finalisation')
ON CONFLICT DO NOTHING;

-- Tâches d'exemple
INSERT INTO tasks (title, description, due_date, priority, status, assigned_user, prospect_id, created_by) VALUES
('Appeler M. Dupont', 'Rappel pour présentation produits seniors', CURRENT_DATE, 'high', 'todo', 3, 1, 1),
('Envoyer devis Marie Martin', 'Préparer devis personnalisé complémentaire santé', CURRENT_DATE + INTERVAL '1 day', 'medium', 'todo', 3, 4, 1),
('RDV Sophie Bernard', 'Rendez-vous signature contrat obsèques', CURRENT_DATE + INTERVAL '2 days', 'high', 'in_progress', 3, 6, 1),
('Suivi Pierre Durand', 'Appel de suivi satisfaction client', CURRENT_DATE + INTERVAL '7 days', 'low', 'todo', 4, 5, 1),
('Relance Françoise Petit', 'Relance téléphonique suite demande info', CURRENT_DATE - INTERVAL '1 day', 'medium', 'todo', 3, 8, 1)
ON CONFLICT DO NOTHING;

-- Campagnes d'exemple
INSERT INTO campaigns (name, description, campaign_type, status, start_date, end_date, budget, target_audience, created_by) VALUES
('Campagne Santé Senior Printemps 2024', 'Promotion complémentaire santé pour seniors 65+', 'email', 'active', '2024-03-01', '2024-05-31', 5000.00, '{"age_min": 65, "age_max": 80, "status": ["nouveau", "qualifié"]}', 1),
('Obsèques Été 2024', 'Campagne assurance obsèques période estivale', 'sms', 'terminee', '2024-06-01', '2024-08-31', 3000.00, '{"age_min": 70, "products_interest": ["obsèques"]}', 1),
('Dépendance Automne 2024', 'Sensibilisation assurance dépendance', 'phone', 'active', '2024-09-01', '2024-11-30', 8000.00, '{"age_min": 68, "status": ["qualifié", "en_negociation"]}', 1)
ON CONFLICT DO NOTHING;

-- Templates d'emails
INSERT INTO email_templates (name, subject, content, category, variables, created_by) VALUES
('Bienvenue Nouveau Prospect', 'Bienvenue chez AssurCRM - Votre protection senior', 
'<h2>Bonjour {{prenom}} {{nom}},</h2>
<p>Merci de votre intérêt pour nos solutions d''assurance dédiées aux seniors.</p>
<p>Nous vous contacterons dans les 24h pour vous présenter nos offres adaptées à vos besoins.</p>
<p>Cordialement,<br>L''équipe AssurCRM</p>', 
'bienvenue', '["prenom", "nom", "age", "ville"]', 1),

('Relance Prospect', 'N''oubliez pas votre demande d''assurance senior', 
'<h2>Bonjour {{prenom}},</h2>
<p>Nous n''avons pas eu de nouvelles suite à votre demande concernant {{produit}}.</p>
<p>Nos conseillers restent à votre disposition pour répondre à vos questions.</p>
<p>Contactez-nous au 01 23 45 67 89</p>', 
'relance', '["prenom", "produit", "date_demande"]', 1),

('Devis Personnalisé', 'Votre devis personnalisé AssurCRM', 
'<h2>Bonjour {{prenom}} {{nom}},</h2>
<p>Veuillez trouver ci-joint votre devis personnalisé pour {{produit}}.</p>
<p><strong>Cotisation mensuelle : {{cotisation}}€</strong></p>
<p>Ce devis est valable 30 jours. N''hésitez pas à nous contacter pour toute question.</p>', 
'devis', '["prenom", "nom", "produit", "cotisation", "validite"]', 1)
ON CONFLICT DO NOTHING;

-- Workflows d'exemple
INSERT INTO workflows (name, description, trigger_type, trigger_conditions, actions, created_by) VALUES
('Accueil Nouveau Prospect', 'Workflow automatique pour nouveaux prospects', 'prospect_created', 
'{"status": "nouveau"}', 
'[{"type": "send_email", "template_id": 1, "delay": 0}, {"type": "create_task", "title": "Appeler nouveau prospect", "delay": 1440}]', 1),

('Relance Prospect Inactif', 'Relance automatique prospects sans activité', 'prospect_inactive', 
'{"days_inactive": 7, "status": ["nouveau", "qualifié"]}', 
'[{"type": "send_email", "template_id": 2, "delay": 0}, {"type": "update_status", "new_status": "relance_auto"}]', 1)
ON CONFLICT DO NOTHING;

-- Segments clients
INSERT INTO client_segments (name, description, criteria, created_by) VALUES
('Seniors 65-70 ans', 'Prospects seniors entre 65 et 70 ans', '{"age_min": 65, "age_max": 70}', 1),
('Prospects Qualifiés Santé', 'Prospects qualifiés intéressés par assurance santé', '{"status": "qualifié", "products_interest": ["santé"]}', 1),
('Clients Inactifs', 'Prospects sans activité depuis 30 jours', '{"last_activity": 30, "status": ["nouveau"]}', 1)
ON CONFLICT DO NOTHING;

-- Activités d'exemple
INSERT INTO activities (type, title, description, prospect_id, user_id) VALUES
('call', 'Appel avec Jean Durand', 'Présentation des produits seniors - intéressé par complémentaire santé', 5, 3),
('email', 'Email envoyé à Marie Leblanc', 'Envoi devis personnalisé assurance dépendance', 4, 3),
('meeting', 'RDV Sophie Bernard', 'Rendez-vous au bureau pour signature contrat', 6, 3),
('note', 'Note sur Pierre Durand', 'Client très satisfait, possibilité de recommandations', 5, 4)
ON CONFLICT DO NOTHING;
