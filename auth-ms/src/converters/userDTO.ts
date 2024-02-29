import { IUser } from "auth-ms/src/models/User";
import { UserDTO } from "shared/dtos/userDTO";

export function mapUserToUserDTO(user: IUser): UserDTO {
    const userDto: UserDTO = {
        _id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone,
        roles: user.roles
    }
    return userDto;
}