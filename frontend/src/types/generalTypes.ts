export type UserRender = {
    id: string;
    username: string;
    dispalyName: string;
    email: string;
    createdAt: string;
};

export type WsResponse = {
    type: "message";
    content: string;
    user: UserRender[];
};
