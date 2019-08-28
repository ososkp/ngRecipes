import { Subject } from 'rxjs';

export class RepositoryService {
  save(list: any[], subject: Subject<any>) {
    subject.next(list.slice());
  }
}