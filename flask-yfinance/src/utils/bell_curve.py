# from flask import send_file
# import pandas as pd 
# import matplotlib.pyplot as plt
# import io
# import app

# @app.route('/hist.png')
# def create_bell_curve (data_set: list):
#     list_to_df = pd.DataFrame(data_set, columns=data_set['returnOnEquity'])
#     list_to_df['returnOnEquity'].plot.hist(bins=10, color='blue', edgecolor='black')
#     plt.xlabel('returnOnEquity')
#     plt.ylabel('Frequency')
    
#     img = io.BytesIO()
#     plt.savefig(img, format='png')
#     img.seek(0)
#     plt.close

#     return send_file(img, mimetype='hist/png')
    