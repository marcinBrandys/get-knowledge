export enum Translations {
  APP_TITLE = 'Get Knowledge',
  MENU_ITEM_DASHBOARD = 'Strona główna',
  MENU_ITEM_LEARN = 'Nauka',
  MENU_ITEM_TEST = 'Testy',
  MENU_ITEM_GROUPS = 'Klasy',
  MENU_ITEM_TASK_GENERATOR = 'Kreator zadań',
  MENU_ITEM_LOGOUT = 'Wyloguj',
  TITLE_LOGIN = 'Logowanie',
  ENTER_EMAIL = 'Adres email',
  ENTER_NICK = 'Nazwa użytkownika',
  EMAIL_REQUIRED = 'Wprowadź adres email',
  EMAIL_INVALID = 'Wprowadź poprawny adres email',
  ENTER_PASSWORD = 'Hasło',
  PASSWORD_REQUIRED = 'Wprowadź hasło',
  ACTION_LOGIN = 'Zaloguj',
  ACTION_CLOSE = 'Zamknij',
  LOGIN_ERROR_WRONG_CREDENTIALS = 'Błędne dane logowania',
  LOGIN_SUCCESS = 'Zalogowano',
  TITLE_REGISTER = 'Rejestracja',
  ACTION_REGISTER = 'Zarejestruj',
  ATTRIBUTE_FIRST_NAME = 'Imię',
  ATTRIBUTE_LAST_NAME = 'Nazwisko',
  ATTRIBUTE_NICK = 'Nazwa użytkownika',
  ATTRIBUTE_EMAIL = 'Adres email',
  ATTRIBUTE_AGE = 'Wiek',
  ATTRIBUTE_GENDER = 'Płeć',
  ATTRIBUTE_GENDER_MALE = 'Mężczyzna',
  ATTRIBUTE_GENDER_FEMALE = 'Kobieta',
  ATTRIBUTE_GENDER_INVALID = 'Wybierz płeć',
  ATTRIBUTE_ROLE = 'Rodzaj konta',
  ATTRIBUTE_ROLE_TEACHER_ACCESS_CODE = 'Kod nauczycielski',
  ATTRIBUTE_ROLE_ADMIN = 'Administrator',
  ATTRIBUTE_ROLE_TEACHER = 'Nauczyciel',
  ATTRIBUTE_ROLE_STUDENT = 'Uczeń',
  ATTRIBUTE_ROLE_INVALID = 'Wybierz rodzaj konta',
  REGISTER_STEP_1 = 'Dane konta',
  REGISTER_STEP_2 = 'Dane osobowe',
  REGISTER_STEP_3 = 'Rodzaj konta',
  REGISTER_SUCCESS = 'Konto zostało utworzone. Możesz się zalogować.',
  REGISTER_FAIL = 'Rejestracja nie powiodła się, spróbuj ponownie.',
  REGISTER_FAIL_DUPLICATE_KEY = 'Podana nazwa użytkownika jest zajęta',
  ACTION_LOGOUT = 'Wyloguj',
  TITLE_CREATE_GROUP = 'Załóż klasę',
  ACTION_CREATE_GROUP = 'Załóż klasę',
  ATTRIBUTE_GROUP_NAME = 'Nazwa klasy',
  TITLE_GROUPS = 'Klasy',
  TITLE_GROUP = 'Klasa',
  TITLE_STUDENTS = 'Uczniowie',
  TITLE_STUDENT = 'Uczeń',
  ACTION_ADD_STUDENT_TO_GROUP = 'Dodaj ucznia do klasy',
  ACTION_ADD = 'Dodaj',
  EMPTY_GROUP = 'Klasa jest pusta. Dodaj uczniów do klasy.',
  ATTRIBUTE_ACTIONS = 'Czynności',
  TITLE_CREATE_TASK_GROUP = 'Dodawanie grupy zadań',
  CREATE_TASK_GROUP_SUCCESS = 'Dodano grupę zadań',
  TITLE_TASK_GROUPS = 'Grupy zadań',
  TITLE_TASK_TYPES = 'Typy zadań',
  TITLE_SELECT_FILTERS = 'Wybierz grupę i typ zadań',
  ATTRIBUTE_TASK_GROUP_NAME = 'Nazwa grupy zadań',
  ATTRIBUTE_TASK_IS_TEST_GROUP = 'Grupa pytań testowych?',
  TITLE_CREATE_TASK = 'Dodawanie zadania',
  ATTRIBUTE_TASK_TITLE = 'Tytuł zadania',
  ATTRIBUTE_TASK_TYPE = 'Typ zadania',
  ATTRIBUTE_TASK_CONTENT = 'Treść zadania',
  ATTRIBUTE_TASK_TIP = 'Podpowiedź',
  ATTRIBUTE_TASK_TIP_SHOW = 'Rozwiń aby skorzystać z podpowiedzi',
  ATTRIBUTE_TASK_PRESENTED_VALUE = 'Zawartość prezentowana',
  ATTRIBUTE_TASK_CORRECT_SOLUTION = 'Prawidłowa odpowiedź',
  ATTRIBUTE_TASK_WEIGHT = 'Waga zadania',
  ATTRIBUTE_TASK_POINTS = 'Punktacja zadania',
  ATTRIBUTE_TASK_SOLUTION = 'Odpowiedź',
  ACTION_SKIP_TASK = 'Pomiń zadanie',
  ACTION_SUBMIT_TASK_SOLUTION = 'Zatwierdź odpowiedź',
  ACTION_NEXT_TASK = 'Kolejne zadanie',
  TITLE_ATTRIBUTE_TASK_GROUP = 'Grupa zadań',
  TASK_TYPE_T_01 = 'Otwarte',
  TASK_TYPE_T_02 = 'Otwarte z podpowiedzią',
  TASK_TYPE_W_01 = 'Jednokrotnego wyboru',
  TASK_TYPE_W_02 = 'Wielokrotnego wyboru',
  TASK_TYPE_W_03 = 'Prawda / Fałsz',
  TASK_TYPE_W_04 = 'Wybór z uzasadnieniem',
  TASK_TYPE_S_01 = 'Sortowanie pionowe',
  TASK_TYPE_S_02 = 'Sortowanie poziome',
  TASK_TYPE_G_01 = 'Grupowanie (przeciąganie)',
  TASK_TYPE_G_02 = 'Grupowanie (wybór)',
  TITLE_CORRECT_ANSWER = 'Odpowiedź prawidłowa!',
  TITLE_INCORRECT_ANSWER = 'Odpowiedź błędna!',
  TITLE_TRUE = 'Prawda',
  TITLE_FALSE = 'Fałsz',
  TITLE_TASK_ADDED = 'Dodano zadanie',
  TITLE_TASK_ADDING_ERROR = 'Wystąpił błąd podczas dodawania zadania, spróbuj ponownie',
  TITLE_TASK_ADD_CANCEL = 'Anuluj',
  TITLE_ADD_SOLUTION_PLACEHOLDER = 'Możliwa odpowiedź',
  TITLE_ADD_SOLUTION_REASON_PLACEHOLDER = 'Możliwe uzasadnienie',
  TITLE_FIRST_PART_OF_SOLUTION = 'Odpowiedź',
  TITLE_SECOND_PART_OF_SOLUTION = 'Uzasadnienie',
  TITLE_ADD_SOLUTION_ELEMENT_PLACEHOLDER = 'Element do sortowania',
  TITLE_ADD_SOLUTION_GROUP_PLACEHOLDER = 'Nazwa grupy',
  TITLE_ADD_SOLUTION_GROUP_ELEMENT_PLACEHOLDER = 'Nazwa elementu do grupowania',
  TITLE_GROUP_ELEMENTS_PLACEHOLDER = 'Elementy do grupowania',
  TITLE_WELCOME = 'Witaj',
  TITLE_WELCOME_TEXT = 'Zachęcamy do korzystania z systemu, rozwiązywania zadań i pogłębiania swojej wiedzy.',
  TITLE_WELCOME_TEXT_TEACHER = 'Zachęcamy do korzystania z systemu, układaj zadania i sprawdzaj wiedzę uczniów.',
  TITLE_AVAILABLE_TASK_GROUPS = 'Możesz rozwiązywać zadania z grup:',
  TITLE_AVAILABLE_TASK_GROUPS_TASKS = 'Działy ćwiczeniowe',
  TITLE_AVAILABLE_TASK_GROUPS_TESTS = 'Testy',
  TITLE_STATS = 'Statystyki',
  TITLE_STATS_POINTS = 'Zbobyte punkty',
  TITLE_STATS_CORRECT_SOLUTIONS = 'Poprawne odpowiedzi',
  TITLE_STATS_INVALID_SOLUTIONS = 'Błędne odpowiedzi',
  TITLE_STATS_AVG_SOLUTION_DURATION = 'Średni czas trawania rozwiązywania zadania',
  TITLE_STATS_AVG_SOLUTION_DUR = 'Średni czas rozwiązania',
  TITLE_RANK = 'Ranking użytkowników',
  TITLE_RANK_OF_CLASS = 'Ranking grupy',
  TITLE_PLACE = 'Miejsce',
  TITLE_EMPTY_TASK = 'Brak zadania, wybierz inną grupę lub typ zadań',
  TITLE_START_DATE = 'Data rozpoczęcia',
  TITLE_END_DATE = 'Data zakończenia',
  TITLE_WRONG_DATES = 'Wprowadzono nieprawidłowe daty testu',
  TITLE_EMPTY_TESTS = 'Brak dostępnych testów',
  TITLE_AVAILABLE_TESTS = 'Testy do rozwiązania',
  TITLE_TEST_INDEX = 'Numer testu',
  TITLE_TEST_NAME = 'Nazwa testu',
  TITLE_TEST_START_DATE = 'Data rozpoczęcia',
  TITLE_TEST_END_DATE = 'Data zakończenia',
  ACTION_START_TEST = 'Rozwiąż',
  TITLE_SOLUTION_SUBMITTED = 'Odpowiedź została zapisana',
  TITLE_TEST_ENDED = 'Test został ukończony, a odpowiedzi zapisane. Wyniki będą dostępne po terminie zakończenia testu.',
  ACTION_GO_BACK = 'Powrót',
  TITLE_TASKS_REMAIN_NUMBER = 'Liczba pozostałych pytań'
}
