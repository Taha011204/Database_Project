interface BasicUser {
  readonly userID: number;
  readonly email: string;
  readonly username: string;
}

export interface AdminProps extends BasicUser {
  authenticated: boolean;
}

export interface CustomerProps extends BasicUser {}

export interface BookProps {
  readonly ISBN: string;
  readonly title: string;
  readonly author: string;
  readonly subject: string;
  readonly class: string;
  readonly edition: string;
  readonly remarks: string;
  readonly userID: number;
}

export interface BookWithUserProps extends BookProps {
  readonly email: string;
  readonly username: string;
}
