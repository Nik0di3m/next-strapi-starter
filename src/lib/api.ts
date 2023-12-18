import qs from "qs";

type FilterOperation =
  | { $eq?: string | number } // equal, for slug and id filters
  | { $lt?: number } // less than
  | { $gt?: number }; // greater than
// U can add here other filter operations from Strapi https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication#filtering

type IFiltersObj = {
  [key: string]: FilterOperation;
};

type ILanguage = "pl" | "en";

type QueryParams = {
  [key: string]: string | number | boolean;
};

type QueryParamsArray = {
  [key: string]: string[] | string | number | IFiltersObj;
};

export const getStrapiContent = async ({
  slug,
  lang = "pl",
  queryObj,
}: {
  slug: string;
  lang: ILanguage;
  queryObj?: QueryParamsArray;
}) => {
  const query = qs.stringify(queryObj, {
    addQueryPrefix: true,
    arrayFormat: "indices",
    encodeValuesOnly: true,
  });

  const res = await fetch(
    `${process.env.API_SERVER_URL}/api/${slug}${query}&locale=${lang}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 10 },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error("Error fetching content data");
    });

  return res.data;
};
