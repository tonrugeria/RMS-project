const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'novice0621**',
    database: 'rms',
  },
});

const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  user: 'postgres',
  database: 'rms',
  password: 'novice0621**',
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
CREATE TABLE IF NOT EXISTS Admin.Position_Level(
    position_level_id SERIAL PRIMARY KEY NOT NULL,
    position_level_name VARCHAR(100) NOT NULL
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
    skill_score VARCHAR(100) NOT NULL,
    hr_rating VARCHAR(100) NOT NULL,
    personality_score VARCHAR(100) NOT NULL,
    date_opened DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_date_update DATE NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    last_updated_by VARCHAR(100) NOT NULL,
    status INT NOT NULL
);
CREATE TABLE IF NOT EXISTS Jobs.Skill (
    job_id INT NOT NULL,
    skill_id INT,
    skill_level INT,
    record_id SERIAL PRIMARY KEY NOT NULL,

    FOREIGN KEY (job_id)
    REFERENCES Jobs.Job_Opening(job_id),
    FOREIGN KEY (skill_id)
    REFERENCES Admin.Skill(skill_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Job_Details(
    job_id INT NOT NULL,
    role VARCHAR,
    item_sort SERIAL PRIMARY KEY NOT NULL,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Responsibility(
    job_id INT NOT NULL,
    responsibility_id SERIAL PRIMARY KEY NOT NULL,
    responsibility_detail VARCHAR,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Qualification(
    job_id INT NOT NULL,
    qualification_id SERIAL PRIMARY KEY NOT NULL,
    qualification_detail VARCHAR,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Category(
    job_id INT NOT NULL,
    category_id SERIAL PRIMARY KEY NOT NULL,
    category_detail VARCHAR,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Jobs.Item(
    job_id INT NOT NULL,
    category_id INT,
    item_id SERIAL PRIMARY KEY NOT NULL,
    item_detail VARCHAR,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id),
    FOREIGN KEY(category_id)
    REFERENCES Jobs.Category(category_id)
);

CREATE SCHEMA IF NOT EXISTS Question;
CREATE TABLE IF NOT EXISTS Question.Question (
    question_id INT PRIMARY KEY NOT NULL,
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
CREATE TABLE IF NOT EXISTS Jobs.Question(
    job_id INT,
    question_id INT,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id),
    FOREIGN KEY(question_id)
    REFERENCES Question.Question(question_id)
);
CREATE SCHEMA IF NOT EXISTS Job_Application;
CREATE TABLE IF NOT EXISTS Job_Application.Applicant_details(
    job_id int NOT NULL,
    application_id INT PRIMARY KEY NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    date_of_birth date NOT NULL,
    email VARCHAR(100) NOT NULL,
    skype VARCHAR(100) NOT NULL,
    mobile VARCHAR(100) NOT NULL,
    preferred_contact VARCHAR(100) NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    expected_salary INT NOT NULL,
    start_date date,
    preferred_interview_date_1 date,
    preferred_interview_date_2 date,
    preferred_interview_date_3 date,
    technical_test_score int NOT NULL,
    personality_test_score int NOT NULL,
    year_experience	int NOT NULL,
    photo VARCHAR(100) NOT NULL,
    date_applied date,
    date_last_updated date ,
    application_link VARCHAR(100) NOT NULL,
    status int NOT NULL,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id)
);

CREATE TABLE IF NOT EXISTS Job_Application.Education (
    education_id SERIAL PRIMARY KEY NOT NULL,
    application_id	INT NOT NULL,
    school VARCHAR(1000) NOT NULL,
    course VARCHAR(1000) NOT NULL,
    date_graduated date,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);

CREATE TABLE IF NOT EXISTS Job_Application.Applicant_Exam_Answers(
    result_id SERIAL PRIMARY KEY NOT NULL,
    job_id int,
    application_id int,
    question_id int,
    applicant_answer int,

    FOREIGN KEY(job_id)
    REFERENCES Jobs.Job_Opening(job_id),
    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id),
    FOREIGN KEY(question_id)
    REFERENCES Question.Question(question_id)

);

CREATE TABLE IF NOT EXISTS Job_Application.Applicant_rating (
    rating_id SERIAL PRIMARY KEY NOT NULL,
    application_id	INT NOT NULL,
    skill_id INT NOT NULL,
    skill_years INT NOT NULL,
    skill_self_rating INT NOT NULL,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id),
    FOREIGN KEY(skill_id)
    REFERENCES Admin.Skill(skill_id)
);

CREATE TABLE IF NOT EXISTS Job_Application.Capabilities (
    application_id	int NOT NULL,
    capability_id SERIAL PRIMARY KEY NOT NULL,
    capability_1 VARCHAR(1000) NOT NULL,
    capability_2 VARCHAR(1000) NOT NULL,
    capability_3 VARCHAR(1000) NOT NULL,
    capability_4 VARCHAR(1000) NOT NULL,
    capability_5 VARCHAR(1000) NOT NULL,

    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Employment_History (
    history_id SERIAL PRIMARY KEY NOT NULL,
    application_id	int NOT NULL,
    history_start_date date,
    history_end_date date,
    position varchar(100),
    company varchar(100),
    
    FOREIGN KEY(application_id)
    REFERENCES Job_Application.Applicant_details(application_id)
);
CREATE TABLE IF NOT EXISTS Job_Application.Technical_Score (
    tech_score_id SERIAL PRIMARY KEY NOT NULL,
    application_id	int NOT NULL,
    skill_id INT,
    skill_level INT,
    skill_total INT,

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
