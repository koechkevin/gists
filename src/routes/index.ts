import AppRoutes from './AppRoutes';
import { RouteConfig as RouteConfigTyped, routesConfig, StepRoutes } from './config';
import Routes, { ExceptionRoutes } from './Routes';
import RouteWithSubRoutes from './RouteWithSubRoutes';

export type RouteConfig = RouteConfigTyped;

export { AppRoutes, routesConfig, Routes, RouteWithSubRoutes, ExceptionRoutes, StepRoutes };
