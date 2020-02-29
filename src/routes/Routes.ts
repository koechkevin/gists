/**
 * Global App routes enum
 */

export enum Routes {
  App = '/app',
  ApplyAuth = '/apply/auth/email',
  Login = '/login',
  NoPermission = '/app/exception/403',
  NotFound = '/app/exception/404',
  ServerError = '/app/exception/500',
  Candidate = '/app/candidate',
  Application = '/app/candidate/:companyId/application/:id',
  Channel = '/app/candidate/:companyId/channel/:id',
  ForgotPassword = '/forgot-password',
  FillNewPassword = '/fill-new-password',
}

export const ExceptionRoutes: string[] = [
  Routes.NoPermission,
  Routes.NotFound,
  Routes.ServerError,
  Routes.ApplyAuth,
  Routes.ForgotPassword,
  Routes.FillNewPassword,
];

export default Routes;
