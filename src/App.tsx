import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import Auth from "./components/Auth";
import ScrollToTop from "./components/ScrollToTop";
import useSessionStorage from "./hooks/useSessionStorage";
import { Character } from "./models/responseModel";
import CharacterDetailsPage from "./pages/CharacterDetailsPage";
import HomePage from "./pages/HomePage";
import { fetchCharacters, setCharacters } from "./redux/slices/charactersSlice";
import { useAppDispatch } from "./redux/store";
import { DOMRouts } from "./routs/domRouts";

export default function App() {
	const dispatch = useAppDispatch();
	const [charactersSS, setCharactersSS] = useSessionStorage<Character[] | null>(
		"characters",
		null
	);

	useEffect(() => {
		if (charactersSS && charactersSS.length) {
			// Setting up the list of characters from Session Storage to Refux store on page reload otherwise sending request
			dispatch(setCharacters(charactersSS));
			return;
		}
		const promise = dispatch(fetchCharacters(null));

		return () => promise.abort();
	}, []);

	return (
		<ScrollToTop>
			<Auth />
			<Routes>
				<Route path={DOMRouts.HOME_PAGE} element={<HomePage />} />
				<Route
					path={DOMRouts.CHARACTER_DETAILS_PAGE}
					element={<CharacterDetailsPage />}
				/>
				<Route path="*" element={<Navigate to={DOMRouts.HOME_PAGE} />} />
			</Routes>
		</ScrollToTop>
	);
}
