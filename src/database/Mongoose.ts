import { connect } from 'mongoose';

export const connectDatabase = async (uri: string) => {
    await connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    });
    console.log('Database Connected!');
};
