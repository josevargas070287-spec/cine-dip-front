import { http } from "@/lib/http";
import { RespuestaLogin, Credenciales } from "@/types/auth"


const CLAVE_TOKEN = 'cine_token';
export const authService = {
    async login(credenciales: Credenciales): Promise<string> {
        const {data} = await http.post<RespuestaLogin>('/auth/login', credenciales);

        const token = data?.data?.token;

        if (!token) { throw new Error ('El servidor no devolvio un token'); }
        return token;
    },

    // guardar el token
    // el token en el navegador
    guardarToken(token: string) {

        try {
            localStorage.setItem(CLAVE_TOKEN, token)
        } catch{
            
        }
    },
    obtenerToken(): string | null {
        try {
               return localStorage.getItem(CLAVE_TOKEN);
        } catch {
                return null;
        }
    },
    borrarToken() {
        try {
            localStorage.removeItem(CLAVE_TOKEN);
        } catch  {
            // /no se hace nada/

        }
    }
}