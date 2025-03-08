declare namespace MODELS {
    export interface IUser {
        _id?: string;
        email: string;
        password: string;
        name?: string;
        YOB?: number;
        gender?: string;
        isAdmin?: boolean;
    }

    export interface IPerfume {
        _id?: string;
        perfumeName: string;
        uri: string;
        price: number;
        concentration: string;
        description: string;
        targetAudience: string;
        ingredients: string;
        volume: number;
        comments: string;
        brand: IBrand;
    }

    interface IComment {
        _id: string;
        rating: number;
        content: string;
        author: string;
        createAt: string;
    }

    export interface IBrand {
        _id?: string;
        brandName: string;
    }
}