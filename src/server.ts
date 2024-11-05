import { application } from "./app";

const PORT = process.env.PORT || 3000;

application.initializeDatabase();
application.app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
