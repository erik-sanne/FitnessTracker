SET @UsrId = (SELECT id
              FROM users
              WHERE email='basic@test.com');

SET @AdminId = (SELECT id
              FROM users
              WHERE email='admin@test.com');

INSERT INTO workoutset (exercise_name, reps, weight) VALUES
( 'BENCH_PRESS', 5, 80 ),
( 'BENCH_PRESS', 5, 80 ),
( 'BENCH_PRESS', 4, 80 ),

( 'DEADLIFT', 8, 80 ),
( 'DEADLIFT', 5, 90 ),
( 'DEADLIFT', 3, 100 ),
( 'DEADLIFT', 2, 110 ),
( 'DEADLIFT', 1, 120 );

INSERT INTO workouts (user_id, date) VALUES
(@UsrId, CURRENT_TIMESTAMP),
(@UsrId, '2019-09-05 17:08:58.0'),
(@UsrId, '2020-09-05 17:08:58.0'),
(@UsrId, '2020-09-07 17:08:58.0'),
(@UsrId, '2020-09-08 17:08:58.0'),
(@UsrId, '2020-09-09 17:08:58.0'),
(@UsrId, '2020-09-18 17:08:58.0'),
(@UsrId, '2020-09-19 17:08:58.0'),
(@UsrId, '2020-09-20 17:08:58.0'),
(@UsrId, '2020-09-23 17:08:58.0'),
(@UsrId, '2020-10-06 17:08:58.0'),
(@UsrId, '2020-10-16 17:08:58.0'),
(@UsrId, '2020-10-17 17:08:58.0'),
(@UsrId, '2020-10-18 17:08:58.0'),
(@UsrId, '2020-10-19 17:08:58.0'),
(@UsrId, '2020-10-20 17:08:58.0'),
(@UsrId, '2020-10-22 17:08:58.0'),
(@UsrId, '2020-10-23 17:08:58.0');

INSERT INTO workouts (user_id, date) VALUES
(@AdminId, CURRENT_TIMESTAMP),
(@AdminId, '2020-09-07 17:08:58.0'),
(@AdminId, '2020-09-08 17:08:58.0'),
(@AdminId, '2020-09-09 17:08:58.0'),
(@AdminId, '2020-09-19 17:08:58.0'),
(@AdminId, '2020-09-20 17:08:58.0'),
(@AdminId, '2020-09-18 17:08:58.0'),
(@AdminId, '2020-09-23 17:08:58.0'),
(@AdminId, '2020-10-06 17:08:58.0'),
(@AdminId, '2020-10-16 17:08:58.0'),
(@AdminId, '2020-10-17 17:08:58.0'),
(@AdminId, '2020-10-18 17:08:58.0'),
(@AdminId, '2020-10-19 17:08:58.0'),
(@AdminId, '2020-10-20 17:08:58.0'),
(@AdminId, '2020-10-22 17:08:58.0'),
(@AdminId, '2020-10-23 17:08:58.0');