import { Photo } from 'src/app/_models/Photo';

export interface User {
    id: number;
    username: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastactive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}
