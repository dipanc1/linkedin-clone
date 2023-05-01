import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { from, map, Observable, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { User } from "../models/user.class";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(user: User): Observable<User> {
    const { firstName, lastName, email, password } = user;

    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword
          })
        ).pipe(
          map((user: User) => {
            delete user.password;
            return user;
          })
        );
      })
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { email: email } })).pipe(
      switchMap((user: User) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: "Invalid Credentials" },
            HttpStatus.NOT_FOUND
          );
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          })
        );
      })
    );
  }

  login(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          return from(this.jwtService.signAsync({ user }));
        }
      })
    );
  }

  findUserById(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id: id } })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      })
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
}
