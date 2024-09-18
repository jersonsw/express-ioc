import {Application} from './framework/application';
import {MainModule} from './main.module';

async function bootstrap() {
    const app = new Application(MainModule);

    await app.launch(3000);
}

bootstrap().then();
