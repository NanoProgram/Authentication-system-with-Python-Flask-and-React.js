const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			user_id: null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			login: async (email, password) => {
				await fetch(
				  "https://3001-4geeksacade-reactflaskh-5miqvr1ae3n.ws-us89.gitpod.io/api/login?email=${email}&password=${password}",
				  {
					method: "POST",
					body: JSON.stringify({ email, password }),
					headers: { "Content-Type": "application/json" },
				  }
				)
				  .then((res) => res.json())
				  .then((data) => {
					if (data.token) {
					  // guardar el token en el almacenamiento local o en el estado de la aplicación
					  localStorage.setItem("token", data.token);
					  console.log("Logueado correctamente");
					  setStore({ user_id: data.user_id });
					  localStorage.setItem("user_id", data.user_id);
					} else {
					  console.log("No se recive token");
					  // manejar el error de autenticación
					}
				  })
				  .catch((error) => console.log(error));
			  },
			  logout: () => {
				console.log("llamando a logout");
				localStorage.clear();
				setStore({ user_id: null });
			  },
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
