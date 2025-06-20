import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"


async function start() {
    try {
        const port = 3333
        const app = await NestFactory.create(AppModule)
        app.setGlobalPrefix('/api')
        app.enableCors()

        const config = new DocumentBuilder()
            .setTitle('Разработка веб приложения для мониторинга цифровых активов пользователя')
            .setDescription('Документация REST API')
            .setVersion('1.0.0')
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('/api/docs', app, document)

        await app.listen(port, () => {console.log(`Сервер запущен на порту ${port}`)})
    } catch(e: any) {
        console.log(e)
    }
}

start()