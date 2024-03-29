SET @UsrId = (SELECT id
              FROM users
              WHERE email='basic@test.com');

SET @AdminId = (SELECT id
              FROM users
              WHERE email='admin@test.com');

INSERT INTO workouts (user_id, date) VALUES
(@UsrId, '2019-09-05 17:08:58.0'),
(@UsrId, '2020-08-27 17:08:58.0'),
(@UsrId, '2020-08-28 17:08:58.0'),
(@UsrId, '2020-08-29 17:08:58.0'),
(@UsrId, '2020-09-01 17:08:58.0'),
(@UsrId, '2020-09-03 17:08:58.0'),
(@UsrId, '2020-09-05 17:08:58.0'),
(@UsrId, '2020-09-07 17:08:58.0'),
(@UsrId, '2020-09-08 17:08:58.0'),
(@UsrId, '2020-09-09 17:08:58.0'),
(@UsrId, '2020-09-18 17:08:58.0'),
(@UsrId, '2020-09-19 17:08:58.0'),
(@UsrId, '2020-09-20 17:08:58.0'),
(@UsrId, '2020-09-23 17:08:58.0'),
(@UsrId, '2020-10-06 17:08:58.0'),
(@UsrId, '2020-10-01 17:08:58.0'),
(@UsrId, '2020-10-02 17:08:58.0'),
(@UsrId, '2020-10-05 17:08:58.0'),
(@UsrId, '2020-10-08 17:08:58.0'),
(@UsrId, '2020-10-10 17:08:58.0'),
(@UsrId, '2020-10-12 17:08:58.0'),
(@UsrId, '2020-10-14 17:08:58.0'),
(@UsrId, '2020-10-16 17:08:58.0'),
(@UsrId, '2020-10-17 17:08:58.0'),
(@UsrId, '2020-10-18 17:08:58.0'),
(@UsrId, '2020-10-19 17:08:58.0'),
(@UsrId, '2020-10-20 17:08:58.0'),
(@UsrId, '2020-10-22 17:08:58.0'),
(@UsrId, '2020-10-23 17:08:58.0'),
(@UsrId, '2020-10-27 17:08:58.0'),
(@UsrId, '2020-10-28 17:08:58.0'),
(@UsrId, '2020-10-29 17:08:58.0'),
(@UsrId, '2020-10-30 17:08:58.0'),
(@UsrId, '2020-11-03 17:08:58.0'),
(@UsrId, '2020-11-04 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-07 17:08:58.0'),
(@UsrId, '2020-11-10 17:08:58.0');

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

INSERT INTO workoutset (exercise_name, reps, weight, workout_id) VALUES
( 'BENCH_PRESS', 5, 80, 30 ),
( 'BENCH_PRESS', 5, 80, 30 ),
( 'BENCH_PRESS', 4, 80, 30 ),

( 'DEADLIFT', 8, 80, 30 ),
( 'DEADLIFT', 5, 90, 30 ),
( 'DEADLIFT', 3, 100, 30 ),
( 'DEADLIFT', 2, 110, 30 ),
( 'DEADLIFT', 1, 120, 30 ),

( 'ROW', 8, 70, 30 ),
( 'ROW', 8, 70, 30 ),
( 'ROW', 6, 70, 30 );

INSERT INTO workoutset (exercise_name, reps, weight, workout_id) VALUES
( 'BENCH_PRESS', 5, 80, 40 );

INSERT INTO workoutset (exercise_name, reps, weight, workout_id) VALUES
( 'DEADLIFT', 5, 80, 45 );

INSERT INTO workoutset (exercise_name, reps, weight, workout_id) VALUES
( 'DEADLIFT', 7, 80, 46 );

INSERT INTO workoutset (exercise_name, reps, weight, workout_id) VALUES
( 'DEADLIFT', 3, 90, 47 );