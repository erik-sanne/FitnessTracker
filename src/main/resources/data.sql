INSERT INTO users (id, email, password, permission_level) VALUES
(0, 'admin@test.com', '$2y$10$sxeeAfb0tnzVtM.YE60ia.4FsUOHh2zCn4hOrcwq2PI76E5S/eUym', 'ADMIN'),
(1, 'basic@test.com', '$2y$10$sxeeAfb0tnzVtM.YE60ia.4FsUOHh2zCn4hOrcwq2PI76E5S/eUym', 'BASIC');

INSERT INTO wtype (name) VALUES
('PUSH'),
('PULL'),
('LEGS'),
('CORE'),
('ARMS'),
('BACK'),
('CHEST'),
('SHOULDERS');

INSERT INTO target (name) VALUES
('UPPER_CHEST'),
('LOWER_CHEST'),
('BICEPS'),
('TRICEPS'),
('LATS'),
('REAR_DELTS'),
('SIDE_DELTS'),
('FRONT_DELTS'),
('QUADS'),
('HAMSTRINGS'),
('CALVES'),
('GLUTES'),
('SPINAL_ERECTORS'),
('TRAPS'),
('RHOMBOIDS'),
('CORE'),
('OBLIQUES');

INSERT INTO targets_wtypes (target_name, wtype_name) VALUES
('UPPER_CHEST', 'PUSH'),
('UPPER_CHEST', 'CHEST'),
('LOWER_CHEST', 'PUSH'),
('LOWER_CHEST', 'CHEST'),
('BICEPS', 'PULL'),
('BICEPS', 'ARMS'),
('TRICEPS', 'PUSH'),
('TRICEPS', 'ARMS'),
('LATS', 'PULL'),
('LATS', 'BACK'),
('REAR_DELTS', 'PULL'),
('REAR_DELTS', 'SHOULDERS'),
('SIDE_DELTS', 'PULL'),
('SIDE_DELTS', 'PUSH'),
('SIDE_DELTS', 'SHOULDERS'),
('FRONT_DELTS', 'PUSH'),
('FRONT_DELTS', 'SHOULDERS'),
('QUADS', 'LEGS'),
('HAMSTRINGS', 'LEGS'),
('CALVES', 'LEGS'),
('GLUTES', 'LEGS'),
('SPINAL_ERECTORS', 'PULL'),
('SPINAL_ERECTORS', 'BACK'),
('TRAPS', 'PULL'),
('TRAPS', 'BACK'),
('RHOMBOIDS', 'PULL'),
('RHOMBOIDS', 'BACK'),
('CORE', 'CORE'),
('OBLIQUES', 'CORE');

INSERT INTO exercise (name) VALUES
('BENCH_PRESS'),
('DEADLIFT'),
('SQUAT'),
('PULLUP'),
('PULLDOWN'),
('PULLOVER'),
('CHINUP'),
('DIP');


INSERT INTO exercise_primary_targets (exercise_name, primary_targets_name) VALUES
('BENCH_PRESS', 'LOWER_CHEST'),
('BENCH_PRESS', 'UPPER_CHEST'),

('DEADLIFT', 'SPINAL_ERECTORS'),
('DEADLIFT', 'TRAPS'),
('DEADLIFT', 'RHOMBOIDS'),
('DEADLIFT', 'GLUTES'),
('DEADLIFT', 'HAMSTRINGS'),

('SQUAT', 'QUADS'),
('SQUAT', 'GLUTES');


INSERT INTO exercise_secondary_targets (exercise_name, secondary_targets_name) VALUES
('BENCH_PRESS', 'FRONT_DELTS'),
('BENCH_PRESS', 'TRICEPS'),

('DEADLIFT', 'QUADS'),
('DEADLIFT', 'LATS'),

('SQUAT', 'SPINAL_ERECTORS'),
('SQUAT', 'HAMSTRINGS');