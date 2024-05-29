import { UserHistoryProvider } from "../Account/CreateRecord/UserHistory/UserHistoryContext";
import { Private } from "./PrivateRoom/PrivateRoom";
export const PrivateRoom = () => {

     return (
          <div>
            <UserHistoryProvider>
                <Private/>
            </UserHistoryProvider>
          </div>
          
     );
};
