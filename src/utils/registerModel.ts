import { DvaInstance, Model } from 'dva';

// Register model dynamically and cache the registered model
const cached: any = {};

export default function registerModel(app: DvaInstance, model: Model) {
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}
