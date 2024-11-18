import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";

export function Recovered() {
  return (
    <div>
      <form>
        <div className="flex flex-row items-center justify-center lg:justify-start">
          <h1 className="text-lg lg:text-2xl font-bold mb-0 mr-4">
            Senha resetada com sucesso!
          </h1>
        </div>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <Button>
            <Link to="/login" replace>
              Faça login
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
