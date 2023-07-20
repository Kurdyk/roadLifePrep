import { act, cleanup, waitFor } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "@jest/globals";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import InterventionListComposant from "components/intervention/interventionPage";


const server = setupServer(
    rest.get("http://localhost:5555/roads/:id", (req, res, ctx) => {

    const {id} = req.params;

    const result = [
        {
            id: "0",
            name: {city: "Paris", postalCode: "75009", streetName: "Avenue de la République"},
            wearScore: 50,
            roadPosition: [[0.5, 0.5], [-0.5, -0.5]],
        },
        {
            id: "1",
            name: {city: "Bordeaux", postalCode: "45083", streetName: "Boulevard du port"},
            wearScore: 82,
            roadPosition: [[-0.5, 0.5], [0.5, -0.5]],
        },
        {
            id: "2",
            name: {city: "Dijon", postalCode: "21110", streetName: "Place Darcy"},
            wearScore: 50,
            roadPosition: [[0.5, -0.5], [-0.5, 0.5]],
        },
        ][parseInt(id as string)];

        return res(
        ctx.json({
            road: result
        })
        );
    }),
    rest.get("http://localhost:5111/interventions", (req, res, ctx) => {
        return res(
        ctx.json({
            interventionList: [
                { id:"0", roadId:"0", roadUrl:"http://localhost:5555/roads/0", 
                askDate:"03/07/2023", state:0, description:"A nice description"},

                { id:"1", roadId:"1", roadUrl:"http://localhost:5555/roads/1", 
                askDate:"05/07/2023", state:1, description:"A 2nd nice description", refusalDate:"06/07/2023", 
                refusalDescription:"On a pas les sous"},

                { id:"2", roadId:"2", roadUrl:"http://localhost:5555/roads/2", 
                askDate:"07/07/2023", state:2, description:"A nice description again", acceptanceDate:"08/07/2023",},

                { id:"3", roadId:"0", roadUrl:"http://localhost:5555/roads/0", 
                askDate:"09/07/2023", state:3, description:"A last nice description", acceptanceDate:"10/07/2023",
                realisationDate: "13/07/2023", report:"C'est réparé", wearGain: 34},

            ],
        })
        );
    })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Road component test", () => {
    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });

    test("Searchers display", async () => {
        render(<InterventionListComposant />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        expect(screen.getByText('Selection de la date de demande:')).toBeInTheDocument();
        expect(screen.getByText("Selection de l'état:")).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: "" })).toBeInTheDocument(); // research bar
        expect(screen.getByText("Demander une intervention")).toBeInTheDocument();
        
    });

    test("List display", async () => {
        render(<InterventionListComposant />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100)); // Allow component to update
        });

        expect(screen.getAllByText("Demandée").length).toBe(1);
        expect(screen.getAllByText("En cours").length).toBe(1);
        expect(screen.getAllByText("Refusée").length).toBe(1);
        expect(screen.getAllByText("Terminée").length).toBe(1);
    });

});
