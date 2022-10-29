import { AppModule } from "./modules/app.module";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  return await NestFactory.createApplicationContext(AppModule);
}
export const app = bootstrap();
