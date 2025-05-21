from fastapi import APIRouter 
import requests

router = APIRouter()

ZORA_SUBGRAPH_URL = "https://api.zora.co/graphql"

@router.get("/verificar-nft-onchain/{carteira}")
def verificar_nft_onchain(carteira: str):
    query = """
    query NFTsByOwner($owner: String!) {
      tokens(where: {owner: $owner}) {
        nodes {
          token {
            tokenId
            name
            metadata {
              image
              attributes {
                trait_type
                value
              }
            }
          }
        }
      }
    }
    """

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    variables = {
        "owner": carteira.lower()
    }

    try:
        response = requests.post(
            ZORA_SUBGRAPH_URL,
            json={"query": query, "variables": variables},
            headers=headers
        )

        data = response.json()
        tokens = data.get("data", {}).get("tokens", {}).get("nodes", [])

        if not tokens:
            return {"possui_nft": False, "detalhes": []}

        detalhes = []
        for t in tokens:
            meta = t["token"]
            detalhes.append({
                "tokenId": meta["tokenId"],
                "nome": meta.get("name", ""),
                "atributos": meta["metadata"].get("attributes", [])
            })

        return {"possui_nft": True, "detalhes": detalhes}

    except Exception as e:
        return {"erro": str(e)}
