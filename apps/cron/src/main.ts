import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { CronModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(CronModule);
  const port = process.env.PORT;
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configSwagger = new DocumentBuilder()
    .setTitle('Quadra Open API - Seeds auto activity')
    .setDescription(
      `Selamat datang di **Quadra Karya Santosa Open API**, sebuah layanan API yang dirancang untuk membantu developer, khususnya yang sedang belajar frontend, dalam memahami dan mengintegrasikan data.
    \n**Tentang Kami**  
    API ini dibuat oleh **Dionisius Aditya Octa Nugraha**, CTO dari **Quadra Karya Santosa**. Kami berkomitmen untuk memberikan solusi teknologi terbaik yang tidak hanya mendukung bisnis, tetapi juga mendukung komunitas developer dalam pembelajaran dan pengembangan keterampilan.  
    Silakan gunakan API ini untuk belajar, eksperimen, atau membangun aplikasi Anda sendiri! Kami juga menyediakan dokumentasi terperinci untuk setiap endpoint.  
    \n**Hubungi Kami**  
    Jika Anda memiliki pertanyaan atau feedback, jangan ragu untuk menghubungi kami melalui [email](mailto:dionisiusadityaoctanugraha@gmail.com) atau kunjungi [website kami](https://quadrakaryasantosa.com).`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('https://open-api.quadrakaryasantosa.com/seeds')
    .addServer(`http://localhost:${port}`)
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, () => {
    console.log('[REST]', `http://localhost:${port}`);
  });
}
bootstrap();
