import * as Rivet from '@ironclad/rivet-node';
import RivetPluginFs from "rivet-plugin-fs";
import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { plugins as rivetPlugins } from '@ironclad/rivet-core';
//import cors from 'cors';

Rivet.globalRivetNodeRegistry.registerPlugin(RivetPluginFs(Rivet));
Rivet.globalRivetNodeRegistry.registerPlugin(rivetPlugins.anthropic);

const app = express();

const port = 3000;

//app.use(cors());

//console.log(process.env.OPENAPIKEY);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const post = req.body;

  /* example:
      const inputs = {
        task: { type: 'string', value: 'Crea un API che prenda dalla tabella Products il nome, categoria e prezzo' },
        filament: { type: 'string', value: 'true' },
        test: { type: 'string', value: 'true' },
      };*/

  const inputs = {
    task: { type: 'string', value: post.task },
    filament: { type: 'string', value: post.filament.toString() },
    test: { type: 'string', value: post.test.toString() },
  };

  //console.log(inputs);

  await rivet(res, inputs);

  //res.send('Code Generated Successfully');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

async function rivet(res, data) {
  await Rivet.runGraphInFile('./Api.rivet-project', {
    graph: 'Flex Code Generator',
    externalFunctions: {
      async getTask() {
        return data.task
      },
      async getTest() {
        return data.test
      },
      async getFilament() {
        return data.filament
      }
    },
    onUserEvent: {
      myEvent(data) {
        console.log(data);
      },
      setFile(data) {
        res.send(data);
      },
    },
    openAiKey: process.env.OPEN_API_KEY,
    getPluginConfig: {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    },

  });
}