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
          role_name VARCHAR NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Admin.Users (
          user_id SERIAL PRIMARY KEY NOT NULL,
          date_created DATE NOT NULL DEFAULT CURRENT_DATE,
          date_last_updated DATE,
          user_name VARCHAR NOT NULL,
          email VARCHAR,
          password VARCHAR NOT NULL,
          photo VARCHAR,
          role_id INT,
      
          FOREIGN KEY (role_id)
          REFERENCES Admin.User_Role(role_id)
      );
      CREATE TABLE IF NOT EXISTS Admin.System_Theme(
          company_name VARCHAR NOT NULL,
          company_log VARCHAR NOT NULL,
          login_background VARCHAR NOT NULL,
          date_last_updated DATE NOT NULL,
          last_updated_by VARCHAR NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Admin.Job_Position(
          position_id SERIAL PRIMARY KEY NOT NULL,
          position_name VARCHAR NOT NULL,
          position_level INT NOT NULL,
          department_name VARCHAR NOT NULL,
          position_type VARCHAR NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Admin.Department(
        dept_id SERIAL PRIMARY KEY NOT NULL,
        dept_name VARCHAR NOT NULL,
        dept_status VARCHAR
    );
      CREATE TABLE IF NOT EXISTS Admin.Skill(
          skill_id SERIAL PRIMARY KEY NOT NULL,
          skill_name VARCHAR NOT NULL,
          skill_type INT NOT NULL,
          skill_status VARCHAR,

          FOREIGN KEY (skill_type)
          REFERENCES Admin.Department(dept_id)
      );
      CREATE TABLE IF NOT EXISTS Admin.Remarks(
          remark_id SERIAL PRIMARY KEY NOT NULL,
          remark_name VARCHAR NOT NULL,
          remark_status VARCHAR,
      );
      CREATE TABLE IF NOT EXISTS Admin.Job_Type(
          job_type_id SERIAL PRIMARY KEY NOT NULL,
          job_type_name VARCHAR NOT NULL,
          job_type_status VARCHAR,
      );
      CREATE TABLE IF NOT EXISTS Admin.Skill_Level(
          skill_scoring INT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS Admin.Position_Level(
          position_level_id SERIAL PRIMARY KEY NOT NULL,
          position_level_name VARCHAR NOT NULL,
          position_level_status VARCHAR,
      );
      CREATE TABLE IF NOT EXISTS Admin.Branding(
        branding_id SERIAL PRIMARY KEY NOT NULL,
        company_name VARCHAR,
        company_logo VARCHAR,
        login_bg VARCHAR
    );
      CREATE SCHEMA IF NOT EXISTS Jobs;
      CREATE TABLE IF NOT EXISTS Jobs.Job_Opening (
          job_id INT PRIMARY KEY NOT NULL,
          job_title VARCHAR NOT NULL,
          job_dept INT NOT NULL,
          max_salary INT NOT NULL,
          position_level VARCHAR NOT NULL,
          job_type VARCHAR NOT NULL,
          job_description VARCHAR NOT NULL,
          min_years_experience VARCHAR NOT NULL,
          skill_score VARCHAR NOT NULL,
          hr_rating VARCHAR,
          personality_score VARCHAR NOT NULL,
          date_opened date,
          last_date_updated date NOT NULL,
          created_by VARCHAR NOT NULL,
          last_updated_by VARCHAR NOT NULL,
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
          question_category varchar NOT NULL,
          question_level varchar NOT NULL,
          question_detail varchar NOT NULL,
          question_time_limit varchar NOT NULL,
          choice_1 varchar NOT NULL,
          choice_2 varchar NOT NULL,
          choice_3 varchar NOT NULL,
          choice_4 varchar NOT NULL,
          correct_answer int,
          choice_1_value int NOT NULL,
          choice_2_value int NOT NULL,
          choice_3_value int NOT NULL,
          choice_4_value int NOT NULL,
          created_by varchar NOT NULL,
          date_created date NOT NULL,
          last_updated_by varchar NOT NULL,
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
          first_name VARCHAR NOT NULL,
          middle_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          gender VARCHAR NOT NULL,
          date_of_birth date NOT NULL,
          email VARCHAR NOT NULL,
          skype VARCHAR NOT NULL,
          mobile VARCHAR NOT NULL,
          preferred_contact VARCHAR NOT NULL,
          address VARCHAR NOT NULL,
          city VARCHAR NOT NULL,
          province VARCHAR NOT NULL,
          expected_salary INT NOT NULL,
          start_date date,
          preferred_interview_date_1 date,
          preferred_interview_date_2 date,
          preferred_interview_date_3 date,
          technical_test_score int,
          personality_test_score int,
          year_experience	int NOT NULL,
          photo VARCHAR,
          date_applied date,
          date_last_updated date ,
          application_link VARCHAR NOT NULL,
          status int,
          read_status int,
      
          FOREIGN KEY(job_id)
          REFERENCES Jobs.Job_Opening(job_id)
      );
      
      CREATE TABLE IF NOT EXISTS Job_Application.Education (
          education_id SERIAL PRIMARY KEY NOT NULL,
          application_id	INT NOT NULL,
          school VARCHAR NOT NULL,
          course VARCHAR NOT NULL,
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
          question_type int,
      
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
          capability_1 VARCHAR NOT NULL,
          capability_2 VARCHAR NOT NULL,
          capability_3 VARCHAR NOT NULL,
          capability_4 VARCHAR NOT NULL,
          capability_5 VARCHAR NOT NULL,
      
          FOREIGN KEY(application_id)
          REFERENCES Job_Application.Applicant_details(application_id)
      );
      CREATE TABLE IF NOT EXISTS Job_Application.Employment_History (
          history_id SERIAL PRIMARY KEY NOT NULL,
          application_id	int NOT NULL,
          history_start_date date,
          history_end_date date,
          position varchar,
          company varchar,
          
          FOREIGN KEY(application_id)
          REFERENCES Job_Application.Applicant_details(application_id)
      );
      CREATE TABLE IF NOT EXISTS Job_Application.Technical_Score (
          tech_score_id SERIAL PRIMARY KEY NOT NULL,
          application_id	int NOT NULL,
          skill_id INT,
          skill_score INT,
          skill_total INT,
          skill_level NUMERIC(3, 0),
      
          FOREIGN KEY(application_id)
          REFERENCES Job_Application.Applicant_details(application_id)
      );
      CREATE TABLE IF NOT EXISTS Job_Application.Personality_Score (
          score_id SERIAL PRIMARY KEY NOT NULL,
          application_id INT NOT NULL,
          score	int,
      
          FOREIGN KEY(application_id)
          REFERENCES Job_Application.Applicant_details(application_id)
      );`;

execute(text).then((result) => {
  if (result) {
    console.log('Schemas and tables created');
  }
});

module.exports = knex;
