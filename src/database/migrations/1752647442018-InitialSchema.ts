import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1752647442018 implements MigrationInterface {
    name = 'InitialSchema1752647442018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_details" ("details_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "patient_id" uuid NOT NULL, "height" numeric(5,2), "weight" numeric(5,2), "medical_history" text, CONSTRAINT "UQ_0dcebcfda628a69077449498917" UNIQUE ("patient_id"), CONSTRAINT "REL_0dcebcfda628a6907744949891" UNIQUE ("patient_id"), CONSTRAINT "PK_e572d84b53d136312be3e16cd85" PRIMARY KEY ("details_id")); COMMENT ON COLUMN "patient_details"."height" IS 'Height in meters'; COMMENT ON COLUMN "patient_details"."weight" IS 'Weight in kilograms'`);
        await queryRunner.query(`CREATE TABLE "patients" ("patient_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "weight" integer, CONSTRAINT "UQ_7fe1518dc780fd777669b5cb7a0" UNIQUE ("user_id"), CONSTRAINT "REL_7fe1518dc780fd777669b5cb7a" UNIQUE ("user_id"), CONSTRAINT "PK_1dc2db3a63a0bf2388fbfee86b1" PRIMARY KEY ("patient_id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("chat_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "message" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb573d310bde330521e7715db2a" PRIMARY KEY ("chat_id"))`);
        await queryRunner.query(`CREATE TABLE "reschedule_history" ("reschedule_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid NOT NULL, "original_date" TIMESTAMP WITH TIME ZONE NOT NULL, "new_date" TIMESTAMP WITH TIME ZONE NOT NULL, "reason" text NOT NULL, "logged_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6f5d8d3d6417e4a71ddabf7ad5" PRIMARY KEY ("reschedule_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("appointment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doctor_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "date_time" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'SCHEDULED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dde485d1b7ca51845c075befb6b" PRIMARY KEY ("appointment_id"))`);
        await queryRunner.query(`CREATE TABLE "doctors" ("doctor_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "specialization" character varying NOT NULL, "availability_schedule" jsonb, "services" text array, CONSTRAINT "UQ_653c27d1b10652eb0c7bbbc4427" UNIQUE ("user_id"), CONSTRAINT "REL_653c27d1b10652eb0c7bbbc442" UNIQUE ("user_id"), CONSTRAINT "PK_24821d9468276ddc40107fc0819" PRIMARY KEY ("doctor_id")); COMMENT ON COLUMN "doctors"."availability_schedule" IS 'Stores doctor availability rules'`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('DOCTOR', 'PATIENT', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "age" integer, "gender" "public"."users_gender_enum", "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "patient_details" ADD CONSTRAINT "FK_0dcebcfda628a69077449498917" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_1e09e326485759a027f13a99298" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_ed49245ae87902459011243d69a" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reschedule_history" ADD CONSTRAINT "FK_88f4b0132f95158526c2d33073b" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "reschedule_history" DROP CONSTRAINT "FK_88f4b0132f95158526c2d33073b"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_ed49245ae87902459011243d69a"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_1e09e326485759a027f13a99298"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0"`);
        await queryRunner.query(`ALTER TABLE "patient_details" DROP CONSTRAINT "FK_0dcebcfda628a69077449498917"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP TABLE "reschedule_history"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "patient_details"`);
    }

}
