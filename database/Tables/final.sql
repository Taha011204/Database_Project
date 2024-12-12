SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;



CREATE TABLE public."Books" (
    "ISBN" character varying(64) NOT NULL,
    title character varying(64),
    author character varying(64),
    subject character varying(64),
    class character varying(64),
    edition character varying(64),
    remarks character varying(128),
    "userID" integer NOT NULL
);


ALTER TABLE public."Books" OWNER TO postgres;



CREATE TABLE public."BookDetails" (
    "ISBN" character varying(64) NOT NULL,
    condition integer NOT NULL,
    stock integer NOT NULL
);


ALTER TABLE public."BookDetails" OWNER TO postgres;



CREATE TABLE public."Transactions" (
    "ISBN" character varying(64) NOT NULL,
    date date NOT NULL,
    condition integer NOT NULL,
    "userID" integer NOT NULL
);


ALTER TABLE public."Transactions" OWNER TO postgres;


CREATE TABLE public."Users" (
    username character varying(64) NOT NULL,
    email character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    "userID" integer NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;


CREATE TABLE public."UserInteractions" (
    "bookRequest" character varying(128),
    "userID" integer NOT NULL
);


ALTER TABLE public."UserInteractions" OWNER TO postgres;

--Random data just for checking process during project building
INSERT INTO public."Books" VALUES ('978-0451524935', 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'ENG101', '1st', 'Good condition, paperback', 1);
INSERT INTO public."Books" VALUES ('978-0061120084', '1984', 'George Orwell', 'Dystopian Fiction', 'POL101', '3rd', 'Hardcover, like new', 1);
INSERT INTO public."Books" VALUES ('978-0141187761', 'One Hundred Years of Solitude', 'Gabriel Garcia Marquez', 'Magical Realism', 'SPN201', '2nd', 'Used, annotations present', 2);
INSERT INTO public."Books" VALUES ('978-0735219090', 'Educated: A Memoir', 'Tara Westover', 'Autobiography', 'BIO301', '1st', 'Excellent condition', 3);
INSERT INTO public."Books" VALUES ('978-0066620992', 'The Da Vinci Code', 'Dan Brown', 'Mystery', 'ART202', '4th', 'Paperback, spine creased', 4);
INSERT INTO public."Books" VALUES ('978-1400033416', 'The Kite Runner', 'Khaled Hosseini', 'Historical Fiction', 'HIS401', '2nd', 'Good condition, hardcover', 5);
INSERT INTO public."Books" VALUES ('978-0812993547', 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Anthropology', 'ANT101', '5th', 'Like new, no markings', 3);
INSERT INTO public."Books" VALUES ('978-0544003415', 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 'LIT201', '3rd', 'Hardcover, with maps', 6);
INSERT INTO public."Books" VALUES ('978-0345545964', 'The Girl on the Train', 'Paula Hawkins', 'Thriller', 'PSY301', '2nd', 'Used, some highlighting', 7);
INSERT INTO public."Books" VALUES ('978-0671027346', 'The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-Age Fiction', 'ENG102', '1st', 'Paperback, worn cover', 8);
INSERT INTO public."Books" VALUES ('978-0385490814', 'The Alchemist', 'Paulo Coelho', 'Philosophy', 'PHI201', '4th', 'Excellent condition, inspirational', 9);
INSERT INTO public."Books" VALUES ('978-0062315007', 'Gone Girl', 'Gillian Flynn', 'Psychological Thriller', 'PSY302', '3rd', 'Hardcover, slight water damage', 9);
INSERT INTO public."Books" VALUES ('978-0316769480', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Literature', 'ENG202', '2nd', 'Like new, annotated', 10);
INSERT INTO public."Books" VALUES ('978-0452284234', 'Freakonomics: A Rogue Economist', 'Steven D. Levitt, Stephen J. Dubner', 'Economics', 'ECO101', '5th', 'Paperback, good condition', 5);
INSERT INTO public."Books" VALUES ('978-0064407663', 'Matilda', 'Roald Dahl', 'Children''s Literature', 'EDU202', '1st', 'Hardcover, illustrated edition', 8);
INSERT INTO public."Books" VALUES ('978-12345678', 'Charlie and Chocolate Factory', 'Roald Dahl', 'English', '7', '2nd', 'It is a new Book', 2);
INSERT INTO public."Books" VALUES ('000-12345678', 'update Charlie', NULL, NULL, NULL, NULL, NULL, 2);
INSERT INTO public."Books" VALUES ('123-12345678', NULL, NULL, NULL, NULL, NULL, NULL, 2);
INSERT INTO public."Books" VALUES ('978-07362df19199', 'The Hobbit1', NULL, NULL, NULL, NULL, NULL, 2);
INSERT INTO public."Books" VALUES ('123-123995678', 'Charlie and Chocolate Factory', 'Roald Dahl', 'English', '7', '2nd', 'It is a new Book', 2);
INSERT INTO public."Books" VALUES ('001-11111110', 'The Hobbit1', 'Roald Dahl', 'English', '7', '2nd', 'It is a new Book', 2);




INSERT INTO public."BookDetails" VALUES ('123-12345678', 10, 30);
INSERT INTO public."BookDetails" VALUES ('123-12345678', 9, 9);
INSERT INTO public."BookDetails" VALUES ('123-123995678', 100, 0);
INSERT INTO public."BookDetails" VALUES ('978-0066620992', 5, 5);
INSERT INTO public."BookDetails" VALUES ('978-1400033416', 6, 5);
INSERT INTO public."BookDetails" VALUES ('978-0812993547', 7, 2);
INSERT INTO public."BookDetails" VALUES ('978-0544003415', 2, 2);
INSERT INTO public."BookDetails" VALUES ('978-0345545964', 2, 5);
INSERT INTO public."BookDetails" VALUES ('978-0671027346', 3, 4);
INSERT INTO public."BookDetails" VALUES ('978-0385490814', 3, 4);
INSERT INTO public."BookDetails" VALUES ('978-0062315007', 6, 4);
INSERT INTO public."BookDetails" VALUES ('978-0316769480', 9, 4);
INSERT INTO public."BookDetails" VALUES ('978-0452284234', 9, 4);
INSERT INTO public."BookDetails" VALUES ('978-0064407663', 8, 4);
INSERT INTO public."BookDetails" VALUES ('978-0066620992', 8, 4);
INSERT INTO public."BookDetails" VALUES ('978-0062315007', 2, 5);
INSERT INTO public."BookDetails" VALUES ('978-0316769480', 2, 5);
INSERT INTO public."BookDetails" VALUES ('978-0544003415', 1, 5);
INSERT INTO public."BookDetails" VALUES ('978-0345545964', 3, 3);
INSERT INTO public."BookDetails" VALUES ('978-0812993547', 5, 1);
INSERT INTO public."BookDetails" VALUES ('978-0544003415', 4, 1);
INSERT INTO public."BookDetails" VALUES ('978-0345545964', 9, 1);
INSERT INTO public."BookDetails" VALUES ('001-11111110', 100, 0);
INSERT INTO public."BookDetails" VALUES ('978-0735219090', 5, 4);
INSERT INTO public."BookDetails" VALUES ('000-12345678', 10, 100);




INSERT INTO public."Transactions" VALUES ('978-0735219090', '2024-12-01', 5, 3);
INSERT INTO public."Transactions" VALUES ('123-12345678', '2024-12-01', 9, 2);




INSERT INTO public."Users" VALUES ('taha', 'taha@nu.edu.pk', '89959', 1);
INSERT INTO public."Users" VALUES ('kundan', 'kundan@nu.edu.pk', '23846', 3);
INSERT INTO public."Users" VALUES ('ghazali', 'ghazali@nu.edu.pk', '32357', 4);
INSERT INTO public."Users" VALUES ('rayyan', 'rayyan@nu.edu.pk', '71633', 7);
INSERT INTO public."Users" VALUES ('bilal', 'bilal@nu.edu.pk', '75952', 5);
INSERT INTO public."Users" VALUES ('shakir', 'shakir@nu.edu.pk', '88263', 6);
INSERT INTO public."Users" VALUES ('maaz', 'maaz@nu.edu.pk', '42130', 8);
INSERT INTO public."Users" VALUES ('ashar', 'ashar@nu.edu.pk', '84965', 9);
INSERT INTO public."Users" VALUES ('asad', 'asad@nu.edu.pk', '74279', 10);
INSERT INTO public."Users" VALUES ('saad', 'saad@nu.edu.pk', '74279', 10);



INSERT INTO public."UserInteractions" VALUES ('001-11111115', 3);
INSERT INTO public."UserInteractions" VALUES ('001-11111110', 3);




ALTER TABLE ONLY public."Books"
    ADD CONSTRAINT "ISBN" PRIMARY KEY ("ISBN");




ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_USERID" PRIMARY KEY ("userID");




ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "U_USERNAME" UNIQUE (username, email);


--
-- TOC entry 4656 (class 1259 OID 24974)
-- Name: fki_FK_ISBN_BOOKDETAILS_BOOK; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_FK_ISBN_BOOKDETAILS_BOOK" ON public."BookDetails" USING btree ("ISBN");


--
-- TOC entry 4655 (class 1259 OID 25005)
-- Name: fki_FK_USERID_BOOK_USER; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_FK_USERID_BOOK_USER" ON public."Books" USING btree ("userID");


--
-- TOC entry 4659 (class 2606 OID 24969)
-- Name: BookDetails FK_ISBN_BOOKDETAILS_BOOK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookDetails"
    ADD CONSTRAINT "FK_ISBN_BOOKDETAILS_BOOK" FOREIGN KEY ("ISBN") REFERENCES public."Books"("ISBN") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4658 (class 2606 OID 16807)
-- Name: Transaction FK_ISBN_TRANSACTION_BOOK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "FK_ISBN_TRANSACTION_BOOK" FOREIGN KEY ("ISBN") REFERENCES public."Books"("ISBN") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4657 (class 2606 OID 25000)
-- Name: Book FK_USERID_BOOK_USER; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Books"
    ADD CONSTRAINT "FK_USERID_BOOK_USER" FOREIGN KEY ("userID") REFERENCES public."Users"("userID") ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


