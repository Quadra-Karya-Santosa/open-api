import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { ChatApiModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatApiModule);
  const port = process.env.PORT;
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // const asyncApiOptions = new AsyncApiDocumentBuilder()
  //   .setTitle('Feline')
  //   .setDescription('Feline server description here')
  //   .setVersion('1.0')
  //   .setDefaultContentType('application/json')
  //   .addSecurity('user-password', { type: 'userPassword' })
  //   .addServer('feline-ws', {
  //     url: 'ws://localhost:3003',
  //     protocol: 'socket.io',
  //   })
  //   .build();

  // const asyncapiDocument = await AsyncApiModule.createDocument(
  //   app,
  //   asyncApiOptions,
  // );
  // await AsyncApiModule.setup('/api-docs', app, asyncapiDocument);

  await app.listen(port, () => {
    console.log('[REST]', `http://localhost:${port}`);
  });
}
bootstrap();
