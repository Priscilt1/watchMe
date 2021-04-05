import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from './services/api';


interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesProviderProps { //criacao
  children: ReactNode
}

interface MoviesContextData { //para criar contexto
  genres: GenreResponseProps[] //array de generos
  selectedGenreId: number
  selectedGenre: GenreResponseProps //(id, title, name)
  handleClickButton: (id: number) => void //function return vazio
  movies:MovieProps[]
}

const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData) //criando contexto e retornando objeto

export function MoviesProvider({children}: MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    // no value, passa tudo que aplicacao precisa
    <MoviesContext.Provider value={{genres, movies, selectedGenre, selectedGenreId, handleClickButton}}> 
      {children}
    </MoviesContext.Provider>
  )
}

// hook
export function useMovies() {
  const context = useContext(MoviesContext)
  return context
}