import { login } from './auth';

export async function POST(req, res) {
    return login(req, res); // Use the imported login logic
}
