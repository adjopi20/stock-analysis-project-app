from enum import Enum

class Sector (Enum):
    BM = 'Basic Materials'
    CS = 'Communication Services'
    CC = 'Consumer Cyclical'
    CD = 'Consumer Defensive'
    E = 'Energy'
    F = 'Financial Services'
    H = 'Healthcare'
    I = 'Industrials'
    RE = 'Real Estate'
    T = 'Technology'
    U = 'Utilities'

def print_sector():
    for sector in Sector: 
        print(f"sector name: {sector.name}, sector value: {sector.value}")
print_sector()