import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT;
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.set('trust proxy', true);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'https://open-api.quadrakaryasantosa.com',
      'https://ck.quadrakaryasantosa.com',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const appGRPC = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${process.env.AUTH_GRPC_PORT}`,
        package: 'auth',
        protoPath: 'contract/auth.proto',
      },
    },
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Quadra Open API')
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
    .addServer('https://open-api.quadrakaryasantosa.com/auth')
    .addServer(`http://localhost:${port}`)
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, () => {
    console.log('[REST]', `http://localhost:${port}`);
  });

  await appGRPC.listen();
}
bootstrap();
