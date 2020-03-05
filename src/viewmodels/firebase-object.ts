import { DataSnapshot } from 'angularfire2/database/interfaces';

export class FirebaseObject<T> {
  key: string;
  value: T;
}

export class FirebaseCollection {
  payload: DataSnapshot;
  type: string;
  prevKey: string;
  key: string;
}
