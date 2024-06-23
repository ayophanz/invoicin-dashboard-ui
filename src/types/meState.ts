export type MeState = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  emailVerifiedAt: string;
  roles: string[];
  permissions: string[];
  defaultImage: { initial: string; bg_color: string };
  image: string;
  type: string;
  is2faEnable: boolean;
  defaultLogo: { initial: string; bg_color: string };
  logo: string;
  organizationUuid: string;
  organizationName: string;
  organizationEmail: string;
  organizationEmailVerifiedAt: string;
  addresses: object[];
};
