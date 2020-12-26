INSERT INTO users (email, password, verified, permission_level) VALUES
('admin@test.com', '$2y$12$Abfno8jrYESnHvxFpl5d6u17DUHnQpVbHwI05rIHGFL/9k3DA//kG', true, 'ADMIN'),
('basic@test.com', '$2y$12$Abfno8jrYESnHvxFpl5d6u17DUHnQpVbHwI05rIHGFL/9k3DA//kG', true, 'BASIC'),
('empty@test.com', '$2y$12$WQn.dHgqEuJ.c6meeB.ph2juJYml9jSBCTR55qPg9iqIZqQm', true, 'BASIC'),
('testing', '$2y$12$KZW7wsBlmjxQg3QvgIqWuOfwkHA02NwuP2jGmWnI6EPL4tKEFFCfq', true, 'BASIC');