export interface WelcomeEmailTemplate {
  build(params: { names: string; email: string; phoneNumber: string }): string;
}
