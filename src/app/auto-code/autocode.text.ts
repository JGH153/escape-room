/* tslint:disable */
export const AutoText = `INPUT_COLUMNS = [
    tf.feature_column.numeric_column('bmi'),
    tf.feature_column.numeric_column('bp_sys'),
    tf.feature_column.numeric_column('bp_dia')
]

def build_estimator(config, embedding_size=8, hidden_units=None):
  (bmi, bp_sys, bp_dia) = INPUT_COLUMNS
  
  bmi_buckets = tf.feature_column.bucketized_column(
      bmi, boundaries=[16, 18, 25, 30, 35, 40, 45, 50, 60, 70])

  deep_columns = []

  return tf.estimator.LinearClassifier(
      feature_columns=wide_columns,
      config=config)

def csv_serving_input_fn():
  csv_row = tf.placeholder(
      shape=[None],
      dtype=tf.string
  )
  features = parse_csv(csv_row)
  features.pop(LABEL_COLUMN)
  return tf.estimator.export.ServingInputReceiver(features, {'csv_row': csv_row})

def parse_csv(rows_string_tensor):
  row_columns = tf.expand_dims(rows_string_tensor, -1)
  columns = tf.decode_csv(row_columns, record_defaults=CSV_COLUMN_DEFAULTS)
  features = dict(zip(CSV_COLUMNS, columns))

END
`;