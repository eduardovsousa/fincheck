import { useAuth } from "../../../app/hooks/useAuth";
import { Button } from "../../components/Button";

export function Dashboard() {
  const { signout } = useAuth();
  return (
    <div>
      <span>Dashboard page</span>

      <Button onClick={signout}>Sair</Button>
    </div>
  );
}
