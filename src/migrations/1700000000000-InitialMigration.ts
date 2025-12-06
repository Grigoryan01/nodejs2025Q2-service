import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "version" character varying(255),
        "createdAt" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        "updatedAt" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create Artists table
    await queryRunner.query(`
      CREATE TABLE "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_artists" PRIMARY KEY ("id")
      )
    `);

    // Create Albums table
    await queryRunner.query(`
      CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_albums_artist" FOREIGN KEY ("artistId") 
          REFERENCES "artists"("id") ON DELETE SET NULL
      )
    `);

    // Create Tracks table
    await queryRunner.query(`
      CREATE TABLE "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tracks_artist" FOREIGN KEY ("artistId") 
          REFERENCES "artists"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tracks_album" FOREIGN KEY ("albumId") 
          REFERENCES "albums"("id") ON DELETE SET NULL
      )
    `);

    // Create Favorites table
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "trackId" uuid,
        CONSTRAINT "PK_favorites" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_albums_artistId" ON "albums" ("artistId")`);
    await queryRunner.query(`CREATE INDEX "IDX_tracks_artistId" ON "tracks" ("artistId")`);
    await queryRunner.query(`CREATE INDEX "IDX_tracks_albumId" ON "tracks" ("albumId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_tracks_albumId"`);
    await queryRunner.query(`DROP INDEX "IDX_tracks_artistId"`);
    await queryRunner.query(`DROP INDEX "IDX_albums_artistId"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

