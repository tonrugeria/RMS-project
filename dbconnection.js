const knex = require('knex')({
        client: 'pg',
        connection: {
                host: '127.0.0.1',
                port: 5432,
                user: 'postgres',
                password: '12345',
                database: 'rms',
        },
});

const { Pool } = require('pg');

const pool = new Pool({
        host: '127.0.0.1',
        user: 'postgres',
        database: 'rms',
        password: '12345',
        port: 5432,
});

const execute = async (query) => {
        try {
                await pool.connect(); // gets connection
                await pool.query(query); // sends queries
                return true;
        } catch (error) {
                console.error(error.stack);
                return false;
        }
};

const text = `CREATE SCHEMA IF NOT EXISTS Admin;
CREATE TABLE IF NOT EXISTS Admin.User_Role(
    role_id SERIAL PRIMARY KEY NOT NULL,
    role_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    date_last_updated DATE,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    photo VARCHAR(100),
    role_id INT,

    FOREIGN KEY (role_id)
    REFERENCES Admin.User_Role(role_id)
);
CREATE TABLE IF NOT EXISTS Admin.System_Theme(
    company_name VARCHAR(100) NOT NULL,
    company_log VARCHAR(100) NOT NULL,
    login_background VARCHAR(100) NOT NULL,
    date_last_updated DATE NOT NULL,
    last_updated_by VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Job_Position(
    position_id SERIAL PRIMARY KEY NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    position_level INT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    position_type VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Skill(
    skill_id SERIAL PRIMARY KEY NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_type VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Remarks(
    remark_id SERIAL PRIMARY KEY NOT NULL,
    remark_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Job_Type(
    job_type_id SERIAL PRIMARY KEY NOT NULL,
    job_type_name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Skill_Level(
    skill_scoring INT NOT NULL
);
CREATE TABLE IF NOT EXISTS Admin.Department(
    dept_id SERIAL PRIMARY KEY NOT NULL,
    dept_name VARCHAR(100) NOT NULL
);
CREATE SCHEMA IF NOT EXISTS Jobs;
CREATE TABLE IF NOT EXISTS Jobs.Job_Opening (
    job_id INT PRIMARY KEY NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    job_dept VARCHAR(100) NOT NULL,
    max_salary INT NOT NULL,
    position_level VARCHAR(100) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    job_description VARCHAR(100) NOT NULL,
    min_years_experience VARCHAR(100) NOT NULL,
    exam_score VARCHAR(100) NOT NULL,
    hr_rating VARCHAR(100) NOT NULL,
    date_opened DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_date_update DATE NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    last_updated_by VARCHAR(100) NOT NULL,
    status INT NOT NULL
);
CREATE TABLE IF NOT EXISTS Jobs.Skill (
    job_id INT NOT NULL,
    skill_id_1 INT,
    skill_level_1 INT,
    skill_id_2 INT,
    skill_level_2 INT,
    skill_id_3 INT,
    skill_level_3 INT,
    skill_id_4 INT,
    skill_level_4 INT,
    skill_id_5 INT,
    skill_level_5 INT,
    skill_id_6 INT,
    skill_level_6 INT,
    skill_id_7 INT,
    skill_level_7 INT,
    skill_id_8 INT,
    skill_level_8 INT,
    skill_id_9 INT,
    skill_level_9 INT,
    skill_id_10 INT,
    skill_level_10 INT,
    skill_id_11 INT,
    skill_level_11 INT,
    skill_id_12 INT,
    skill_level_12 INT,
    skill_id_13 INT,
    skill_level_13 INT,
    skill_id_14 INT,
    skill_level_14 INT,
    skill_id_15 INT,
    skill_level_15 INT,
    skill_id_16 INT,
    skill_level_16 INT,
    skill_id_17 INT,
    skill_level_17 INT,
    skill_id_18 INT,
    skill_level_18 INT,
    skill_id_19 INT,
    skill_level_19 INT,
    skill_id_20 INT,
    skill_level_20 INT,

    FOREIGN KEY (job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);
CREATE TABLE IF NOT EXISTS Jobs.Question(
    job_id INT NOT NULL,
    question_id_1 INT,
    question_id_2 INT,
    question_id_3 INT,
    question_id_4 INT,
    question_id_5 INT,
    question_id_6 INT,
    question_id_7 INT,
    question_id_8 INT,
    question_id_9 INT,
    question_id_10 INT,
    question_id_11 INT,
    question_id_12 INT,
    question_id_13 INT,
    question_id_14 INT,
    question_id_15 INT,
    question_id_16 INT,
    question_id_17 INT,
    question_id_18 INT,
    question_id_19 INT,
    question_id_20 INT,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Job_Details(
    job_id INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    item_sort INT NOT NULL,
    responsibility_1 VARCHAR(1000),
    responsibility_2 VARCHAR(1000),
    responsibility_3 VARCHAR(1000),
    responsibility_4 VARCHAR(1000),
    responsibility_5 VARCHAR(1000),
    responsibility_6 VARCHAR(1000),
    responsibility_7 VARCHAR(1000),
    responsibility_8 VARCHAR(1000),
    responsibility_9 VARCHAR(1000),
    responsibility_10 VARCHAR(1000),
    responsibility_11 VARCHAR(1000),
    responsibility_12 VARCHAR(1000),
    responsibility_13 VARCHAR(1000),
    responsibility_14 VARCHAR(1000),
    responsibility_15 VARCHAR(1000),
    responsibility_16 VARCHAR(1000),
    responsibility_17 VARCHAR(1000),
    responsibility_18 VARCHAR(1000),
    responsibility_19 VARCHAR(1000),
    responsibility_20 VARCHAR(1000),
    qualification_1 VARCHAR(1000),
    qualification_2 VARCHAR(1000),
    qualification_3 VARCHAR(1000),
    qualification_4 VARCHAR(1000),
    qualification_5 VARCHAR(1000),
    qualification_6 VARCHAR(1000),
    qualification_7 VARCHAR(1000),
    qualification_8 VARCHAR(1000),
    qualification_9 VARCHAR(1000),
    qualification_10 VARCHAR(1000),
    qualification_11 VARCHAR(1000),
    qualification_12 VARCHAR(1000),
    qualification_13 VARCHAR(1000),
    qualification_14 VARCHAR(1000),
    qualification_15 VARCHAR(1000),
    qualification_16 VARCHAR(1000),
    qualification_17 VARCHAR(1000),
    qualification_18 VARCHAR(1000),
    qualification_19 VARCHAR(1000),
    qualification_20 VARCHAR(1000),

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);
CREATE SCHEMA IF NOT EXISTS Question;
CREATE TABLE IF NOT EXISTS Question.Question (
    question_id SERIAL PRIMARY KEY NOT NULL,
    question_type int NOT NULL,
    question_category varchar(100) NOT NULL,
    question_level varchar(100) NOT NULL,
    question_detail varchar(100) NOT NULL,
    question_time_limit varchar(100) NOT NULL,
    choice_1 varchar(100) NOT NULL,
    choice_2 varchar(100) NOT NULL,
    choice_3 varchar(100) NOT NULL,
    choice_4 varchar(100) NOT NULL,
    correct_answer int NOT NULL,
    choice_1_value int NOT NULL,
    choice_2_value int NOT NULL,
    choice_3_value int NOT NULL,
    choice_4_value int NOT NULL,
    created_by varchar(100) NOT NULL,
    date_created date NOT NULL,
    last_updated_by varchar(100) NOT NULL,
    date_last_updated date NOT NULL
);
CREATE SCHEMA IF NOT EXISTS Job_Application;
CREATE TABLE IF NOT EXISTS Job_Application.Applicant_details(
    job_id int NOT NULL,
    application_id int PRIMARY KEY NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    date_of_birth date NOT NULL,
    email VARCHAR(100) NOT NULL,
    skype VARCHAR(100) NOT NULL,
    mobile int NOT NULL,
    preferred_contact VARCHAR(100) NOT NULL,
    preferred_interview_date_1 date NOT NULL,
    preferred_interview_date_2 date NOT NULL,
    preferred_interview_date_3 date NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    technical_test_score int NOT NULL,
    personality_test_score int NOT NULL,
    year_experience	int NOT NULL,
    photo VARCHAR(100) NOT NULL,
    date_applied date NOT NULL,
    date_last_upated date NOT NULL,
    application_link VARCHAR(100) NOT NULL,
    status int NOT NULL,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Applicant_rating (
    application_id	INT NOT NULL,
    skill_id_1	int,
    skill_years_1	int,
    skill_self_rating_1	int,
    skill_id_2	int,
    skill_years_2	int,
    skill_self_rating_2	int,
    skill_id_3	int,
    skill_years_3	int,
    skill_self_rating_3	int,
    skill_id_4	int,
    skill_years_4	int,
    skill_self_rating_4	int,
    skill_id_5	int,
    skill_years_5	int,
    skill_self_rating_5	int,
    skill_id_6	int,
    skill_years_6	int,
    skill_self_rating_6	int,
    skill_id_7	int,
    skill_years_7	int,
    skill_self_rating_7	int,
    skill_id_8	int,
    skill_years_8	int,
    skill_self_rating_8	int,
    skill_id_9	int,
    skill_years_9	int,
    skill_self_rating_9	int,
    skill_id_10	int,
    skill_years_10	int,
    skill_self_rating_10	int,
    skill_id_11	int,
    skill_years_11	int,
    skill_self_rating_11	int,
    skill_id_12	int,
    skill_years_12	int,
    skill_self_rating_12	int,
    skill_id_13	int,
    skill_years_13	int,
    skill_self_rating_13	int,
    skill_id_14	int,
    skill_years_14	int,
    skill_self_rating_14	int,
    skill_id_15	int,
    skill_years_15	int,
    skill_self_rating_15	int,
    skill_id_16	int,
    skill_years_16	int,
    skill_self_rating_16	int,
    skill_id_17	int,
    skill_years_17	int,
    skill_self_rating_17	int,
    skill_id_18	int,
    skill_years_18	int,
    skill_self_rating_18	int,
    skill_id_19	int,
    skill_years_19	int,
    skill_self_rating_19	int,
    skill_id_20	int,
    skill_years_20	int,
    skill_self_rating_20	int,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Capabilities (
    application_id	int NOT NULL,
    capability_1	varchar(100),
    capability_2	varchar(100),
    capability_3	varchar(100),
    capability_4	varchar(100),
    capability_5	varchar(100),
    capability_6	varchar(100),
    capability_7	varchar(100),
    capability_8	varchar(100),
    capability_9	varchar(100),
    capability_10	varchar(100),

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Employment_History (
    application_id	int NOT NULL,
    start_date_1	date,
    end_date_1	date,
    position_1	varchar(100),
    company_1	varchar(100),
    start_date_2	date,
    end_date_2	date,
    position_2	varchar(100),
    company_2	varchar(100),
    start_date_3	date,
    end_date_3	date,
    position_3	varchar(100),
    company_3	varchar(100),
    start_date_4	date,
    end_date_4	date,
    position_4	varchar(100),
    company_4	varchar(100),
    start_date_5	date,
    end_date_5	date,
    position_5	varchar(100),
    company_5	varchar(100),
    start_date_6	date,
    end_date_6	date,
    position_6	varchar(100),
    company_6	varchar(100),
    start_date_7	date,
    end_date_7	date,
    position_7	varchar(100),
    company_7	varchar(100),
    start_date_8	date,
    end_date_8	date,
    position_8	varchar(100),
    company_8	varchar(100),
    start_date_9	date,
    end_date_9	date,
    position_9	varchar(100),
    company_9	varchar(100),
    start_date_10	date,
    end_date_10	date,
    position_10	varchar(100),
    company_10	varchar(100),

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Technical_Score (
    application_id	int NOT NULL,
    skill_id_1 INT,
    skill_level_1 INT,
    skill_id_2 INT,
    skill_level_2 INT,
    skill_id_3 INT,
    skill_level_3 INT,
    skill_id_4 INT,
    skill_level_4 INT,
    skill_id_5 INT,
    skill_level_5 INT,
    skill_id_6 INT,
    skill_level_6 INT,
    skill_id_7 INT,
    skill_level_7 INT,
    skill_id_8 INT,
    skill_level_8 INT,
    skill_id_9 INT,
    skill_level_9 INT,
    skill_id_10 INT,
    skill_level_10 INT,
    skill_id_11 INT,
    skill_level_11 INT,
    skill_id_12 INT,
    skill_level_12 INT,
    skill_id_13 INT,
    skill_level_13 INT,
    skill_id_14 INT,
    skill_level_14 INT,
    skill_id_15 INT,
    skill_level_15 INT,
    skill_id_16 INT,
    skill_level_16 INT,
    skill_id_17 INT,
    skill_level_17 INT,
    skill_id_18 INT,
    skill_level_18 INT,
    skill_id_19 INT,
    skill_level_19 INT,
    skill_id_20 INT,
    skill_level_20 INT,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Personality_Score (
    application_id INT NOT NULL,
    score	int,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);`;

execute(text)
        .then((result) => {
                if (result) {
                        console.log('Schemas and tables created');
                }
        })
        .then(() => pool.end());

module.exports = knex;
