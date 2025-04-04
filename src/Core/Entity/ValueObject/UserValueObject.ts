
export class UserValueObject {

    private readonly userId: string;
    private readonly email: string;

    constructor (userId: string, email: string) {
        this.userId = userId;
        this.email = email;
    }

    public getUserId(): string {
        return this.userId;
    }
    
    public getEmail(): string {
        return this.email;
    }

    public toDTO(): any {
        return {
            id_usuario: this.userId,
            email: this.email
        };
    }

    public static fromDTO(dto: any): UserValueObject {
        return new UserValueObject(dto.id_usuario, dto.email);
    }

}