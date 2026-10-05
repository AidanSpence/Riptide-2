import pandas as pd
import numpy as np


class Cleaning:
    def __init__(self, filename: str):
        self.file = filename

    def convert_then_clean(self):
        pass
        self.clean()

    def clean(self):
        df = pd.read_csv(self.file)
        df = df.drop(columns=['#','Added At'], errors='ignore')
        df['Duration'] = pd.to_timedelta('00:' + df['Duration']).dt.total_seconds()
        df['Explicit'] = df['Explicit'].str.lower().map({'yes': True, 'no': False})
        df.to_csv('clean_'+ self.file, index=False)


if __name__ == '__main__':
    cleaner = Cleaning('merged.csv')
    cleaner.clean()