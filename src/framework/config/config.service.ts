import 'colors';
import {get} from 'lodash';
import {existsSync, readdirSync, readFileSync} from 'fs';
import * as yml from 'js-yaml';
import {customConfigVars} from './custom-config.vars';

const basePath = process.cwd();

const varsRegex = /(\${[a-zA-Z_][_a-zA-Z0-9]*})/gim;
const nodeEnv = process.env.NODE_ENV || 'dev';
const envVars = {...customConfigVars, ...process.env};

export class ConfigService {
    private config: any;

    constructor() {
        this.loadConfigs();
    }

    public get<T>(pathKeys: string, defaultVal?: any): T {
        const res = get(this.config, pathKeys.split(/\./)) as T;
        if (!res && defaultVal) return defaultVal;

        return res;
    }

    private loadConfigs(): void {
        const configDir = `${basePath}/config`;

        if (existsSync(configDir)) {
            this.config = this.filterConfigFilesByEnv(configDir);
        } else {
            console.warn(`\n- You should create the config directory in the root of your project, as follow: \n    --> ${configDir}`);
            console.warn(`\n- Once created ensure to add your config files following the pattern: \n    --> {prod|dev|test}.config.yml`);
        }
    }

    filterConfigFilesByEnv(configDir: string) {
        const fileNames = readdirSync(configDir);
        if (fileNames.length === 0) return {};

        const configFileRegex = new RegExp(`^(${nodeEnv})\\.config\\.(ya?ml)$`);

        const fileName = fileNames.find(file => configFileRegex.test(file));

        if (!fileName) {
            console.warn(`\n- No config file found for the current environment: ${nodeEnv}`);
            return {};
        }

        const filePath = `${configDir}/${fileName}`;
        const fileContent = this.loadAndResolveFileContent(filePath);

        return yml.load(fileContent) || {};
    }

    private loadAndResolveFileContent(filePath: string) {
        const fileContent = readFileSync(filePath, 'utf-8');
        const matchInfo = fileContent.match(varsRegex);

        if (matchInfo) {
            return matchInfo.reduce((acc, keyVar) => {
                const key = keyVar.replace(/[${}]/gi, '');
                const val = envVars[key];
                if (!val) {
                    console.log(`Unknown variable name used in "${filePath}" config file:`, keyVar);
                    return acc;
                }

                return acc.replace(keyVar, val);
            }, fileContent);
        }

        return fileContent;
    }
}
